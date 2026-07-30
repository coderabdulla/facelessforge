import { AIScriptEngine } from "./ai.js";
import { ImageEngine } from "./image.js";
import { VoiceEngine } from "./voice.js";
import { VideoCompositor } from "./video.js";
import { StorageManager, Utils } from "./storage.js";

export class FacelessForgeApp {
constructor() {
this.selectedDuration = 30;
this.scriptEngine = new AIScriptEngine();
this.imageEngine = new ImageEngine();
this.voiceEngine = new VoiceEngine();
this.compositor = new VideoCompositor();
this.storage = new StorageManager();

this.currentProject = null;  
this.init();

}

init() {
this.bindNavigation();
this.bindControls();
this.bindPipelineEvents();
this.renderBlankCanvasState();
}

bindNavigation() {
document.querySelectorAll("#main-nav .nav-btn").forEach((btn) => {
btn.addEventListener("click", () => {
const page = btn.getAttribute("data-page");
document.querySelectorAll(".page-view").forEach((view) => {
view.classList.toggle("hidden", view.id !== `page-${page}`);
});
});
});
}

bindControls() {
document.querySelectorAll("#duration-selector .btn-option").forEach((btn) => {
btn.addEventListener("click", () => {
document.querySelectorAll("#duration-selector .btn-option").forEach((b) => b.classList.remove("active"));
btn.classList.add("active");
this.selectedDuration = Number(btn.getAttribute("data-duration")) || 30;
});
});
}

bindPipelineEvents() {
const generateBtn = document.getElementById("btn-generate-pipeline");
const playBtn = document.getElementById("btn-play-preview");
const exportBtn = document.getElementById("btn-export-video");

if (generateBtn) generateBtn.addEventListener("click", () => this.executePipeline());  
if (playBtn) {
  playBtn.addEventListener("click", () => {
    if (!this.currentProject) {
      return;
    }

    this.compositor.playPreview(this.currentProject.scenes);
  });
}
if (exportBtn) exportBtn.addEventListener("click", () => this.exportVideo());

}

async executePipeline() {
const niche = document.getElementById("niche-select")?.value || "motivation";
const customPrompt = document.getElementById("custom-prompt")?.value || "";

const script = await this.scriptEngine.generateScript({  
  niche,  
  durationSec: this.selectedDuration,  
  customPrompt  
});  

const scenesWithImages = await this.imageEngine.preloadSceneImages(script.scenes);  

this.currentProject = {  
  title: `${script.nicheTitle} (${this.selectedDuration}s)`,  
  scenes: scenesWithImages,  
  createdAt: new Date().toISOString()  
};  

this.storage.saveProject(this.currentProject);  

if (scenesWithImages.length > 0) {  
  this.compositor.renderFrame(scenesWithImages[0].imageElement, 0, "kenburns-zoom");  
}  

document.getElementById("btn-play-preview").disabled = false;  
document.getElementById("btn-export-video").disabled = false;

}

async exportVideo() {
if (!this.currentProject) return;
const blob = await this.compositor.exportVideo(this.currentProject.scenes);
Utils.downloadFile(
  blob,
  `FacelessForge_${Date.now()}.webm`
);
}

renderBlankCanvasState() {
const canvas = document.getElementById("video-canvas");
if (!canvas) return;
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#0f172a";
ctx.fillRect(0, 0, 1080, 1920);
ctx.font = "bold 48px Inter, sans-serif";
ctx.fillStyle = "#818cf8";
ctx.textAlign = "center";
ctx.fillText("FACELESSFORGE 2.0", 540, 960);
}
}

document.addEventListener("DOMContentLoaded", () => {
window.facelessForgeApp = new FacelessForgeApp();
});
