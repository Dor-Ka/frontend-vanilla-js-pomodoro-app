document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.querySelector('.pomodoro__time');
    const startButton = document.querySelector('.pomodoro__button--start');
    const resetButton = document.querySelector('.pomodoro__button--reset');

    let timeLeft = 25 * 60;
    let isRunning = false;
    let timerInterval = null;

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const toggleTimer = () => {
        if (isRunning) {
            clearInterval(timerInterval);
            startButton.textContent = 'Start';
        } else {
            timerInterval = setInterval(() => {
                timeLeft--;
                timeDisplay.textContent = formatTime(timeLeft);

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    alert('Pomodoro session complete!');
                }
            }, 1000);
            startButton.textContent = 'Stop';
        }
        isRunning = !isRunning;
    };

    const resetTimer = () => {
        clearInterval(timerInterval);
        timeLeft = 25 * 60;
        timeDisplay.textContent = formatTime(timeLeft);
        startButton.textContent = 'Start';
        isRunning = false;
    };

    startButton.addEventListener('click', toggleTimer);
    resetButton.addEventListener('click', resetTimer);

    timeDisplay.textContent = formatTime(timeLeft);
});
