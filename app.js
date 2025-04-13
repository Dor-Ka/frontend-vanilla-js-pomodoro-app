document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.querySelector('.pomodoro__time');
    const startButton = document.querySelector('.pomodoro__button--start');
    const resetButton = document.querySelector('.pomodoro__button--reset');
    const themeButton = document.querySelector('.pomodoro__button--theme');
    const body = document.body;
    const pomodoroContainer = document.querySelector('.pomodoro');

    let timeLeft = 25 * 60;
    let isRunning = false;
    let timerInterval = null;

    const startStopSound = new Audio('/sounds/start-stop.mp3');
    startStopSound.preload = 'auto';

    const alarmSound = new Audio('/sounds/alarm-ring.mp3');
    alarmSound.preload = 'auto';

    const stopAlarm = () => {
        alarmSound.pause();
        alarmSound.currentTime = 0;
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeButton.textContent = '🌞';
    }

    themeButton.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeButton.textContent = isDark ? '🌞' : '🌙';
    });

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const saveToLocalStorage = () => {
        localStorage.setItem('pomodoro-timeLeft', timeLeft);
        localStorage.setItem('pomodoro-isRunning', isRunning);
        if (isRunning) {
            localStorage.setItem('pomodoro-lastUpdate', Date.now());
        }
    };

    const loadFromLocalStorage = () => {
        const savedTimeLeft = localStorage.getItem('pomodoro-timeLeft');
        const savedIsRunning = localStorage.getItem('pomodoro-isRunning');
        const savedLastUpdate = localStorage.getItem('pomodoro-lastUpdate');

        if (savedTimeLeft && savedIsRunning) {
            timeLeft = parseInt(savedTimeLeft, 10);
            isRunning = savedIsRunning === 'true';

            if (isRunning && savedLastUpdate) {
                const timeElapsed = Math.floor((Date.now() - savedLastUpdate) / 1000);
                timeLeft = Math.max(0, timeLeft - timeElapsed);
            }
        }
    };

    const updateDisplay = () => {
        timeDisplay.textContent = formatTime(timeLeft);
    };

    const toggleTimer = () => {
        stopAlarm();

        if (isRunning) {
            clearInterval(timerInterval);
            startButton.textContent = 'Start';
            startStopSound.play();
        } else {
            timerInterval = setInterval(() => {
                timeLeft--;
                timeDisplay.textContent = formatTime(timeLeft);

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    alarmSound.play();
                    timeDisplay.textContent = "Time's up!";
                    timeDisplay.style.color = '#ff0000';
                }
            }, 1000);
            startButton.textContent = 'Stop';
            startStopSound.play();
        }
        isRunning = !isRunning;
        saveToLocalStorage();
    };

    const resetTimer = () => {
        stopAlarm();
        clearInterval(timerInterval);
        timeLeft = 25 * 60;
        timeDisplay.textContent = formatTime(timeLeft);
        timeDisplay.style.color = '#000';
        startButton.textContent = 'Start';
        isRunning = false;
        localStorage.clear();
    };

    pomodoroContainer.addEventListener('click', stopAlarm);

    startButton.addEventListener('click', toggleTimer);
    resetButton.addEventListener('click', resetTimer);

    loadFromLocalStorage();
    updateDisplay();

    if (isRunning && timeLeft > 0) {
        toggleTimer();
    }
});
