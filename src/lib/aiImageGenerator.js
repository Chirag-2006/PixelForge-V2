// aiProvider.js - BEST PRACTICE VERSION (2025)
// ✓ Clean error handling
// ✓ Predictable response structure

export async function generateImage(prompt) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  try {
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://pollinations.ai/p/${encodedPrompt}`;

    const response = await fetch(url, {
      signal: controller.signal,
      method: "GET",
    });

    // console.log("response in ai image gener", response);

    clearTimeout(timeoutId); // Clear timer if successful

    // If Pollinations fails, throw error
    if (!response.ok) {
      throw new Error("Pollinations API failed");
    }

    // UPDATE: Verify content type (ensure we got an image, not an HTML error page)
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.startsWith("image")) {
      throw new Error("Invalid response type from AI provider");
    }

    return {
      success: true,
      imageUrl: url,
      message: "AI image generated",
    };
  } catch (err) {
    console.error("⚠️ Pollinations Error:", err.message);

    // Fallback image
    const fallbackUrl = `https://placehold.co/1024x1024/6366f1/ffffff?text=${encodeURIComponent(
      prompt.slice(0, 20)
    )}`;

    return {
      success: false,
      imageUrl: fallbackUrl,
      message: "Fallback image used",
      error: "something went wrong, please try again",
    };
  }
}
