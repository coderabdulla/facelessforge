export class SubtitleEngine {
  constructor() {
    this.canvasWidth = 1080;
    this.canvasHeight = 1920;
  }

  generateTimedWords(text, sceneDuration) {
    if (!text) return [];
    const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
    const duration = sceneDuration / words.length;

    return words.map((word, index) => ({
      word,
      startTime: index * duration,
      endTime: (index + 1) * duration
    }));
  }

  renderSubtitle(ctx, timedWords, sceneTime) {
    if (!ctx || !timedWords || timedWords.length === 0) return;

    let activeIndex = timedWords.findIndex((tw) => sceneTime >= tw.startTime && sceneTime < tw.endTime);
    if (activeIndex === -1) activeIndex = 0;

    const activeWord = timedWords[activeIndex]?.word?.toUpperCase() || "";

    ctx.save();
    ctx.font = "900 68px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 14;
    ctx.strokeText(activeWord, this.canvasWidth / 2, 1550);

    ctx.fillStyle = "#FACC15";
    ctx.fillText(activeWord, this.canvasWidth / 2, 1550);

    ctx.restore();
  }
}
