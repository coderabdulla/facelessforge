export class ImageEngine {
  constructor() {
    this.baseUrl = "https://image.pollinations.ai/prompt/";
    this.defaultWidth = 1080;
    this.defaultHeight = 1920;
    this.imageCache = new Map();
    this.maxRetry = 3;
  }

  buildPrompt(prompt) {
    return `${prompt},
    cinematic lighting,
    ultra realistic,
    photorealistic,
    highly detailed,
    8k,
    vertical 9:16,
    no text,
    no watermark`;
  }

  getPollinationsUrl(prompt, seed = Date.now()) {
    const encoded = encodeURIComponent(this.buildPrompt(prompt));

    return `${this.baseUrl}${encoded}?width=${this.defaultWidth}&height=${this.defaultHeight}&seed=${seed}&model=flux&nologo=true`;
  }

  async loadImage(url, retry = 0) {

    if (this.imageCache.has(url)) {
      return this.imageCache.get(url);
    }

    return new Promise((resolve) => {

      const img = new Image();

      img.crossOrigin = "anonymous";
      img.referrerPolicy = "no-referrer";

      img.onload = () => {
        this.imageCache.set(url, img);
        resolve(img);
      };

      img.onerror = async () => {

        if (retry < this.maxRetry) {

          setTimeout(async () => {

            const image = await this.loadImage(url, retry + 1);
            resolve(image);

          },1000);

        } else {

          resolve(this.createFallbackImage("AI Image Failed"));

        }

      };

      img.src = url;

    });

  }

  async preloadSceneImages(scenes,onProgress=null){

    const total=scenes.length;

    let completed=0;

    const results=[];

    for(const scene of scenes){

      const seed=Math.floor(Math.random()*99999999);

      const url=this.getPollinationsUrl(
        scene.imagePrompt || scene.narration,
        seed
      );

      const image=await this.loadImage(url);

      results.push({
        ...scene,
        seed,
        imageUrl:url,
        imageElement:image
      });

      completed++;

      if(onProgress){

        onProgress(
          completed,
          total,
          Math.floor((completed/total)*100)
        );

      }

    }

    return results;

  }

  createFallbackImage(text){

      const canvas=document.createElement("canvas");

      canvas.width=1080;
      canvas.height=1920;

      const ctx=canvas.getContext("2d");

      ctx.fillStyle="#0f172a";
      ctx.fillRect(0,0,1080,1920);

      ctx.fillStyle="#6366f1";
      ctx.font="bold 60px sans-serif";
      ctx.textAlign="center";
      ctx.fillText("FACELESSFORGE",540,900);

      ctx.fillStyle="#ffffff";
      ctx.font="36px sans-serif";
      ctx.fillText(text,540,980);

      const img=new Image();

      img.src=canvas.toDataURL("image/png");

      return img;

  }

}