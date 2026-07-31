"use strict";
async generateScript({ niche, durationSec, customPrompt }) {

    const prompt = `
You are an expert YouTube Shorts script writer.

Create a ${durationSec}-second faceless video script.

Niche: ${niche}

User Prompt:
${customPrompt}

Return ONLY valid JSON in this format:

{
  "title": "",
  "scenes": [
    {
      "text": "",
      "imagePrompt": "",
      "duration": 5
    }
  ]
}
`;

    const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt
        })
    });

    if (!response.ok) {
        throw new Error("Failed to generate script.");
    }

    const data = await response.json();

    const text =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const clean =
        text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

    return JSON.parse(clean);

}
import { safeFetch }
from "./storage.js";

const response =
await safeFetch(...);

const result = await response.json();
