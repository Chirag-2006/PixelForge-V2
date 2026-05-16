const DEFAULT_WIDTH = 1024;
const DEFAULT_HEIGHT = 1024;
const REQUEST_TIMEOUT_MS = 20000;
const RETRY_DELAY_MS = 800;

const PROVIDERS = [
  {
    name: "pollinations-current",
    baseUrl: "https://gen.pollinations.ai/image",
    defaultModels: ["zimage", "flux"],
    requiresApiKey: true,
  },
  {
    name: "pollinations-legacy",
    baseUrl: "https://image.pollinations.ai/prompt",
    defaultModels: ["turbo", "flux"],
  },
];

function getConfiguredModels() {
  const configuredModels = process.env.POLLINATIONS_IMAGE_MODELS;

  if (!configuredModels) {
    return null;
  }

  return configuredModels
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);
}

function buildImageUrl({ baseUrl, prompt, model, seed }) {
  const url = new URL(`${baseUrl}/${encodeURIComponent(prompt)}`);

  url.searchParams.set("width", String(DEFAULT_WIDTH));
  url.searchParams.set("height", String(DEFAULT_HEIGHT));
  url.searchParams.set("seed", String(seed));
  url.searchParams.set("model", model);
  url.searchParams.set("nologo", "true");
  url.searchParams.set("safe", "true");

  return url;
}

function buildHeaders() {
  const headers = {
    Accept: "image/jpeg,image/png,image/webp,*/*",
  };

  if (process.env.POLLINATIONS_API_KEY) {
    headers.Authorization = `Bearer ${process.env.POLLINATIONS_API_KEY}`;
  }

  return headers;
}

function getErrorMessage(error) {
  if (error?.name === "AbortError") {
    return "AI provider timed out";
  }

  return error?.message || "Unknown AI provider error";
}

function getFallbackUrl(prompt) {
  const text = encodeURIComponent(prompt.slice(0, 40) || "Image unavailable");
  return `https://placehold.co/1024x1024/111827/ffffff?text=${text}`;
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchImage(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: buildHeaders(),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      const details = errorBody ? `: ${errorBody.slice(0, 180)}` : "";
      throw new Error(`Pollinations API failed with ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      throw new Error(`Invalid AI provider response type: ${contentType || "unknown"}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!buffer.length) {
      throw new Error("AI provider returned an empty image");
    }

    return { buffer, contentType };
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildAttempts(maxAttempts) {
  const configuredModels = getConfiguredModels();
  const attempts = [];
  const hasApiKey = Boolean(process.env.POLLINATIONS_API_KEY);

  for (const provider of PROVIDERS) {
    if (provider.requiresApiKey && !hasApiKey) {
      continue;
    }

    const models = configuredModels || provider.defaultModels;

    for (const model of models) {
      attempts.push({ provider, model });
    }
  }

  return attempts.slice(0, Math.max(1, maxAttempts));
}

export async function generateImage(prompt, retries = 3) {
  const cleanPrompt = prompt?.trim();

  if (!cleanPrompt) {
    return {
      success: false,
      imageUrl: getFallbackUrl("Prompt required"),
      error: "Prompt is required",
    };
  }

  const attempts = buildAttempts(retries);

  let lastError = "AI provider failed";

  for (let index = 0; index < attempts.length; index++) {
    const { provider, model } = attempts[index];
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = buildImageUrl({
      baseUrl: provider.baseUrl,
      prompt: cleanPrompt,
      model,
      seed,
    }).toString();

    try {
      console.log(
        `AI image attempt ${index + 1}/${attempts.length}: ${provider.name}, model=${model}`
      );

      const { buffer, contentType } = await fetchImage(imageUrl);

      console.log(`AI image generated: ${provider.name}, model=${model}, type=${contentType}`);

      return {
        success: true,
        imageUrl,
        buffer,
        contentType,
        message: "AI image generated",
      };
    } catch (error) {
      lastError = getErrorMessage(error);
      console.error(
        `AI image attempt ${index + 1}/${attempts.length} failed (${provider.name}, ${model}):`,
        lastError
      );

      if (index < attempts.length - 1) {
        await wait(RETRY_DELAY_MS);
      }
    }
  }

  return {
    success: false,
    imageUrl: getFallbackUrl(cleanPrompt),
    message: "AI image generation failed after retries",
    error: process.env.POLLINATIONS_API_KEY
      ? `${lastError}. Please try again in a moment.`
      : `${lastError}. Add POLLINATIONS_API_KEY to use the reliable Pollinations endpoint.`,
  };
}
