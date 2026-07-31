export class VideoCompositor {

    constructor() {

        this.cameraEffect = "kenburns";
        this.canvas = document.getElementById("video-canvas");
        this.ctx = this.canvas.getContext("2d");

        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.exportWidth = 1080;
this.exportHeight = 1920;
this.fps = 30;

        this.isPlaying = false;
        this.mediaRecorder = null;
this.recordedChunks = [];
this.stream = this.canvas.captureStream(30);
        this.music = new Audio();

this.music.loop = true;

this.music.volume = 0.4;

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
        const subtitle = this.buildSubtitle(
    scene,
    progress
);

this.renderFrame(
    scene.imageElement,
    progress,
    subtitle
);
        let scale = 1;

let offsetX = 0;

let offsetY = 0;

switch(this.cameraEffect){

case "zoomin":

scale = 1 + progress * 0.30;

break;

case "zoomout":

scale = 1.30 - progress * 0.30;

break;

case "panleft":

offsetX = -progress * 120;

break;

case "panright":

offsetX = progress * 120;

break;

case "shake":

offsetX = Math.random()*12-6;

offsetY = Math.random()*12-6;

break;

default:

scale = 1 + progress * 0.15;

}

        const drawWidth = this.width * scale;
        const drawHeight = this.height * scale;

        const x =
(this.width-drawWidth)/2
+offsetX;

const y =
(this.height-drawHeight)/2
+offsetY;

        if (image) {
            if(this.cameraEffect==="fade"){

ctx.globalAlpha =
0.5 + progress*0.5;

}else{

ctx.globalAlpha = 1;

            }
            ctx.filter =

this.cameraEffect==="blur"

?`blur(${3-progress*3}px)`

:"none";
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

    drawSubtitle(subtitle = {}) {

    if (!subtitle.text) return;

    const ctx = this.ctx;

    const text = subtitle.text;

    const currentWord = subtitle.currentWord || -1;

    const words = text.split(" ");

    ctx.textAlign = "center";
    ctx.font = "bold 64px Inter";

    let totalWidth = 0;

    words.forEach(word => {
        totalWidth += ctx.measureText(word + " ").width;
    });

    let x = (this.width - totalWidth) / 2;
    const y = this.height - 180;

    words.forEach((word, index) => {

        const width = ctx.measureText(word + " ").width;

        ctx.fillStyle =
            index === currentWord
                ? "#FFD400"
                : "#FFFFFF";

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 8;

        ctx.strokeText(word, x + width / 2, y);
        ctx.fillText(word, x + width / 2, y);

        x += width;

    });

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
if (this.music.src) {

    this.music.currentTime = 0;

    this.music.play();

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
buildSubtitle(scene, progress) {

    const words = scene.text.split(" ");

    const currentWord = Math.min(
        words.length - 1,
        Math.floor(progress * words.length)
    );

    return {

        text: scene.text,

        currentWord

    };

}
setMusic(src, volume = 0.4) {

    if (!src) {

        this.music.pause();

        return;

    }

    this.music.src = src;

    this.music.volume = volume;

}
setCameraEffect(effect){

    this.cameraEffect = effect;

}
setExportSettings(width,height,fps){

this.exportWidth = width;

this.exportHeight = height;

this.fps = fps;

this.canvas.width = width;

this.canvas.height = height;

this.width = width;

this.height = height;

}
async renderProject(project) {

    if (!project) {
        throw new Error("No project loaded.");
    }

    const scenes = project.scenes || [];

    await this.playPreview(scenes);

    return await this.exportVideo(scenes);

}
async renderScenes(scenes) {

    for (const scene of scenes) {

        await this.renderScene(scene);

    }

}
updateProgress(current,total){

const percent =
Math.round(
(current/total)*100
);

const bar =
document.getElementById(
"render-progress"
);

if(bar){

bar.style.width =
percent+"%";

}

}
