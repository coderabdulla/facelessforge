export class VideoCompositor {
  constructor() {
    this.canvas = document.getElementById("video-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.subtitle = document.getElementById("subtitle-text");
  }

  renderFrame(image, progress = 0, effect = "kenburns-zoom") {
    if (!image) return;

    const ctx = this.ctx;
    const canvas = this.canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let scale = 1;

    if (effect === "kenburns-zoom") {
      scale = 1 + progress * 0.15;
    }

    if (effect === "kenburns-out") {
      scale = 1.15 - progress * 0.15;
    }

    const w = canvas.width * scale;
    const h = canvas.height * scale;

    ctx.drawImage(
      image,
      (canvas.width - w) / 2,
      (canvas.height - h) / 2,
      w,
      h
    );
  }

  async playPreview(scenes) {
    if (!scenes || scenes.length === 0) return;

    for (const scene of scenes) {

      this.subtitle.textContent = scene.narration;

      const duration = (scene.duration || 5) * 1000;

      const start = performance.now();

      await new Promise(resolve => {

        const animate = (time) => {

          const progress = Math.min(
            (time - start) / duration,
            1
          );

          this.renderFrame(
            scene.imageElement,
            progress,
            "kenburns-zoom"
          );

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            resolve();
          }

        };

        requestAnimationFrame(animate);

      });

    }
  }

  async exportVideo(scenes) {

    const stream = this.canvas.captureStream(30);

    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm"
    });

    const chunks = [];

    recorder.ondataavailable = e => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    const finished = new Promise(resolve => {
      recorder.onstop = () => {
        resolve(
          new Blob(chunks, {
            type: "video/webm"
          })
        );
      };
    });

    recorder.start();

    await this.playPreview(scenes);

    recorder.stop();

    return finished;
  }
}