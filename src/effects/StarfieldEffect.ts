export class StarfieldEffect {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private intervalId: number | null = null;
    private stars: { x: number; y: number; z: number }[] = [];
    private numStars = 800;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
    }

    start() {
        if (this.intervalId) return;
        this.resize();
        this.initStars();
        this.intervalId = setInterval(() => this.draw(), 16);
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
    }

    private initStars() {
        this.stars = [];
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width - this.canvas.width / 2,
                y: Math.random() * this.canvas.height - this.canvas.height / 2,
                z: Math.random() * this.canvas.width
            });
        }
    }

    private draw() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        this.ctx.fillStyle = "white";
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            star.z -= 2;

            if (star.z <= 0) {
                star.z = this.canvas.width;
            }

            const x = (star.x / star.z) * this.canvas.width + centerX;
            const y = (star.y / star.z) * this.canvas.height + centerY;
            const size = (1 - star.z / this.canvas.width) * 3;

            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
}
