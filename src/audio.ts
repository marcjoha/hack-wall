export class SoundManager {
    private ctx: AudioContext | null = null;
    private currentNodes: AudioNode[] = [];
    private currentGain: GainNode | null = null;
    private lastNoiseOut = 0; // Moved from global scope

    constructor() {
        // We don't initialize AudioContext immediately to avoid warnings about
        // AudioContext not being allowed to start without user interaction.
    }

    private initContext() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    async resume() {
        this.initContext();
        if (this.ctx && this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }
    }

    stop() {
        if (this.currentGain) {
            // Smooth fade out
            const now = this.ctx?.currentTime || 0;
            this.currentGain.gain.setValueAtTime(this.currentGain.gain.value, now);
            this.currentGain.gain.linearRampToValueAtTime(0, now + 0.5);

            const nodesToStop = [...this.currentNodes];
            setTimeout(() => {
                nodesToStop.forEach(node => {
                    if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
                        try { node.stop(); } catch (e) { /* ignore */ }
                    }
                    node.disconnect();
                });
            }, 550);
        } else {
            this.currentNodes.forEach(node => {
                node.disconnect();
                if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
                    try { node.stop(); } catch (e) { /* ignore */ }
                }
            });
        }

        this.currentNodes = [];
        this.currentGain = null;
    }

    playTheme(theme: string) {
        this.stop();
        this.resume().then(() => {
            if (!this.ctx) return;

            const masterGain = this.ctx.createGain();
            masterGain.gain.value = 0.3; // Specific master volume
            masterGain.connect(this.ctx.destination);
            this.currentGain = masterGain;

            switch (theme) {
                case 'cyber':
                    this.playCyberpunk(masterGain);
                    break;
                case 'space':
                    this.playSpace(masterGain);
                    break;
                case 'arcade':
                    this.playArcade(masterGain);
                    break;
                case 'lounge':
                    this.playLounge(masterGain);
                    break;
                case 'elevator':
                    this.playElevator(masterGain);
                    break;
            }
        });
    }

    // --- Themes ---

    private playCyberpunk(destination: AudioNode) {
        if (!this.ctx) return;

        // Deep drone
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.value = 55; // Low A

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        // LFO for the filter to add movement
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.1; // Slow modulation
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 200; // Filter sweep range

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        osc1.connect(filter);

        // Track-specific volume adjustment
        const trackGain = this.ctx.createGain();
        trackGain.gain.value = 0.6; // Attenuate slightly to match music

        filter.connect(trackGain);
        trackGain.connect(destination);

        osc1.start();
        lfo.start();

        this.currentNodes.push(osc1, filter, lfo, lfoGain, trackGain);
    }

    private playSpace(destination: AudioNode) {
        if (!this.ctx) return;

        // Pink Noise generator (approximate)
        const bufferSize = 2 * this.ctx.sampleRate;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (this.lastNoiseOut + (0.02 * white)) / 1.02;
            this.lastNoiseOut = output[i];
            output[i] *= 3.5; // Compensate for gain loss
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 300; // Windy

        noise.connect(filter);

        // Track-specific volume adjustment
        const trackGain = this.ctx.createGain();
        trackGain.gain.value = 0.7;

        filter.connect(trackGain);
        trackGain.connect(destination);

        noise.start();
        this.currentNodes.push(noise, filter, trackGain);
    }

    private playArcade(destination: AudioNode) {
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.value = 110;

        const osc2 = this.ctx.createOscillator();
        osc2.type = 'square';
        osc2.frequency.value = 112; // Detuned

        osc.start();
        osc2.start();

        const subGain = this.ctx.createGain();
        subGain.gain.value = 0.3;

        osc.connect(subGain);
        osc2.connect(subGain);
        subGain.connect(destination);

        this.currentNodes.push(osc, osc2, subGain);
    }

    private async playLounge(destination: AudioNode) {
        if (!this.ctx) return;
        await this.playSample(import.meta.env.BASE_URL + 'lounge.mp3', 1.0, destination);
    }

    private async playElevator(destination: AudioNode) {
        if (!this.ctx) return;
        await this.playSample(import.meta.env.BASE_URL + 'elevator.mp3', 0.8, destination);
    }

    private async playSample(url: string, volume: number, destination: AudioNode) {
        if (!this.ctx) return;
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);

            const source = this.ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.loop = true;

            const gain = this.ctx.createGain();
            gain.gain.value = volume;

            source.connect(gain);
            gain.connect(destination);

            source.start();
            this.currentNodes.push(source, gain);
        } catch (error) {
            console.error(`Failed to load sound from ${url}:`, error);
        }
    }
}
