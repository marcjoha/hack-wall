export class MatrixEffect {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private intervalId: number | null = null;
    private drops: number[] = [];
    private fontSize = 16;
    private columns = 0;
    private chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    private charArr = this.chars.split("");

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
    }

    start() {
        if (this.intervalId) return;
        this.resize();

        // Pre-warm the animation
        for (let i = 0; i < 100; i++) {
            this.draw();
        }

        this.intervalId = setInterval(() => this.draw(), 33);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = this.canvas.width / this.fontSize;
        this.drops = Array(Math.floor(this.columns)).fill(1);
    }

    private draw() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "#0F0";
        this.ctx.font = this.fontSize + "px monospace";

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.charArr[Math.floor(Math.random() * this.charArr.length)];
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);

            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }
}
