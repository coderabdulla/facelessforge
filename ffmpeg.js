"use strict";
const { FFmpeg } = FFmpegWASM;

export class FFmpegEngine {

    constructor() {

        this.ffmpeg = new FFmpeg();

        this.loaded = false;

    }

    async load() {

        if (this.loaded) return;

        await this.ffmpeg.load();

        this.loaded = true;

    }

    async convert(webmBlob) {

        await this.load();

        const input = "input.webm";
        const output = "output.mp4";

        const data =
            new Uint8Array(
                await webmBlob.arrayBuffer()
            );

        await this.ffmpeg.writeFile(
            input,
            data
        );

        await this.ffmpeg.exec([
            "-i",
            input,
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            output
        ]);

        const file =
            await this.ffmpeg.readFile(output);

        return new Blob(
            [file.buffer],
            {
                type: "video/mp4"
            }
        );

    }

}
