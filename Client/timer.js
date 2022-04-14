export class Timer
{
    timeRemaining;
    onTimerFinished = () => {};
    interval;

    constructor()
    {
        this.timeRemaining = 0;
        this.interval = null;
    }

    startTimer(seconds)
    {
        this.cancelTimer();
        this.timeRemaining = seconds;
        this.interval = setInterval(() => this.decrementTime(), 1000);
        this.updateTimerDisplay();
    }

    decrementTime()
    {
        this.timeRemaining -= 1;
        this.updateTimerDisplay();
        if (this.timeRemaining <= 0)
        {
            this.stopTimer();
        }
    }

    cancelTimer()
    {
        clearInterval(this.interval);
    }

    stopTimer()
    {
        this.cancelTimer();
        this.onTimerFinished();
    }
    
    updateTimerDisplay()
    {
        $("#timer").text(this.timeRemaining);
    }
}

