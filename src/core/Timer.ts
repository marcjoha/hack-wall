export class Timer {
    private intervalId: number | null = null;

    start(targetMs: number, onTick: (display: string, isEnding: boolean) => void) {
        this.stop();

        const update = () => {
            const now = new Date().getTime();
            const distance = targetMs - now;

            if (distance < 0) {
                this.stop();
                onTick("00:00:00", true);
                return;
            }

            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const hStr = hours.toString().padStart(2, '0');
            const mStr = minutes.toString().padStart(2, '0');
            const sStr = seconds.toString().padStart(2, '0');

            onTick(`${hStr}:${mStr}:${sStr}`, false);
        };

        update(); // Initial update
        this.intervalId = setInterval(update, 1000);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
