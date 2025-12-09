// aiProvider.js - robust Pollinations usage (2025-ready)
const DEFAULT_TIMEOUT = 20000;
const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 400;

async function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithTimeout(url, options = {}, timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

/**
 * generateImage(prompt)
 * - Uses enter.pollinations.ai if POLLINATIONS_KEY exists (preferred)
 * - Retries on 429/5xx
 * - Validates content-type and returns a stable object.
 */
export async function generateImage(prompt) {
  const key = process.env.POLLINATIONS_KEY || process.env.POLLINATIONS_API_KEY || null;

  // Preferred modern gateway (documented gateway)
  const gateway = key ? "https://enter.pollinations.ai/api/generate" : `https://pollinations.ai/p/${encodeURIComponent(prompt)}`;

  // If using gateway, send JSON body (recommended)
  const useJson = !!key;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const options = useJson
        ? {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(key ? { Authorization: `Bearer ${key}` } : {}),
            },
            body: JSON.stringify({ prompt }),
          }
        : { method: "GET" };

      const response = await fetchWithTimeout(gateway, options, DEFAULT_TIMEOUT);

      // If not OK, read body to help logging and decide retry
      if (!response.ok) {
        let bodyText = "";
        try { bodyText = await response.text(); } catch (e) { bodyText = "<could not read body>"; }

        console.error(`[Pollinations] attempt ${attempt+1} status=${response.status} url=${gateway} body=${bodyText.slice(0,400)}`);

        // Retry on 429 or 5xx
        if (response.status === 429 || (response.status >= 500 && response.status < 600)) {
          const backoff = BACKOFF_BASE_MS * 2 ** attempt;
          await wait(backoff);
          continue;
        }

        // For other statuses, bail out with structured error
        return {
          success: false,
          imageUrl: null,
          message: "Upstream returned an error",
          error: `Pollinations returned ${response.status}`,
          detail: bodyText.slice(0, 1000),
        };
      }

      // Validate response is an image (for GET gateway) or JSON with image url (for POST gateway)
      const contentType = response.headers.get("content-type") || "";

      if (useJson) {
        // expected JSON { url: "..." } or similar from the gateway
        const data = await response.json().catch(() => null);
        if (data && (data.url || data.image)) {
          return {
            success: true,
            imageUrl: data.url || data.image,
            message: "AI image generated (gateway)",
          };
        }
        // unexpected JSON structure -> return helpful error
        console.error("[Pollinations] unexpected JSON structure:", data);
        return {
          success: false,
          imageUrl: null,
          message: "Unexpected response from Pollinations gateway",
          error: "invalid-json-structure",
          detail: JSON.stringify(data).slice(0,1000),
        };
      } else {
        // legacy direct GET response should be an image binary; we can't redirect binary through serverless easily,
        // so return the direct URL (pollinations provides image at the constructed URL)
        if (contentType.startsWith("image")) {
          const directUrl = gateway; // caller can use this URL in client
          return { success: true, imageUrl: directUrl, message: "AI image generated (legacy)" };
        } else {
          // maybe HTML error page - read it and return as error
          const txt = await response.text().catch(()=>"<no body>");
          console.error("[Pollinations] invalid content-type:", contentType, "body:", txt.slice(0,400));
          return {
            success: false,
            imageUrl: null,
            message: "Invalid response type from Pollinations",
            error: "invalid-content-type",
            detail: contentType,
            snippet: txt.slice(0,1000),
          };
        }
      }
    } catch (err) {
      // fetch error (network/timeout/abort)
      console.error(`[Pollinations] fetch error attempt ${attempt+1}:`, err && err.message ? err.message : err);
      // If aborted/timeout, retry with backoff
      const shouldRetry = attempt < MAX_RETRIES - 1;
      if (shouldRetry) {
        const backoff = BACKOFF_BASE_MS * 2 ** attempt;
        await wait(backoff);
        continue;
      }
      // final failure -> fallback
      const fallbackUrl = `https://placehold.co/1024x1024/6366f1/ffffff?text=${encodeURIComponent(prompt.slice(0,20))}`;
      return {
        success: false,
        imageUrl: fallbackUrl,
        message: "Fallback image used",
        error: err?.message || String(err),
      };
    }
  }

  // exhausted loop (shouldn't reach)
  return {
    success: false,
    imageUrl: null,
    message: "Retries exhausted",
    error: "retries_exhausted",
  };
}
