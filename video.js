export class VideoCompositor {

    constructor() {

        this.canvas = document.getElementById("video-canvas");
        this.ctx = this.canvas.getContext("2d");

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.isPlaying = false;
        this.mediaRecorder = null;
this.recordedChunks = [];
this.stream = this.canvas.captureStream(30);

    };

    this.mediaRecorder.start();

        }
    }
startRecording() {

    this.recordedChunks = [];

    this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: "video/webm;codecs=vp9"
    });

    this.mediaRecorder.ondataavailable = (e) => {

        if (e.data.size > 0) {
            this.recordedChunks.push(e.data);
        }

    };

    this.mediaRecorder.start();

}

stopRecording() {

    return new Promise(resolve => {

        this.mediaRecorder.onstop = () => {

            const blob = new Blob(
                this.recordedChunks,
                {
                    type: "video/webm"
                }
            );

            resolve(blob);

        };

        this.mediaRecorder.stop();

    });

}

    renderFrame(image, progress = 0, subtitle = "") {

        const ctx = this.ctx;

        ctx.clearRect(0, 0, this.width, this.height);

        // Ken Burns Zoom
        const scale = 1 + (progress * 0.15);

        const drawWidth = this.width * scale;
        const drawHeight = this.height * scale;

        const x = (this.width - drawWidth) / 2;
        const y = (this.height - drawHeight) / 2;

        if (image) {
            ctx.drawImage(
                image,
                x,
                y,
                drawWidth,
                drawHeight
            );
        }

        // Dark Overlay
        ctx.fillStyle = "rgba(0,0,0,.25)";
        ctx.fillRect(0, 0, this.width, this.height);

        // Subtitle
        this.drawSubtitle(subtitle);

    }

    drawSubtitle(text = "") {

        if (!text) return;

        const ctx = this.ctx;

        ctx.font = "bold 64px Inter";

        ctx.textAlign = "center";

        ctx.fillStyle = "#ffffff";

        ctx.strokeStyle = "#000000";

        ctx.lineWidth = 8;

        const y = this.height - 180;

        ctx.strokeText(
            text,
            this.width / 2,
            y
        );

        ctx.fillText(
            text,
            this.width / 2,
            y
        );

    }

    async playPreview(scenes) {

        if (!scenes || !scenes.length)
            return;

        this.isPlaying = true;

        for (const scene of scenes) {

            const start = performance.now();

            while (
                performance.now() - start < 3000 &&
                this.isPlaying
            ) {

                const progress =
                    (performance.now() - start) / 3000;

                this.renderFrame(
                    scene.imageElement,
                    progress,
                    scene.text
                );

                await new Promise(r =>
                    requestAnimationFrame(r)
                );

            }

        }

    }

    stopPreview() {

        this.isPlaying = false;

    }

    async exportVideo(scenes) {

    this.startRecording();

    await this.playPreview(scenes);

    const blob = await this.stopRecording();

    return blob;

    }

}
