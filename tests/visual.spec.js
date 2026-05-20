import { test, expect } from "@playwright/test";

const baseUrl = process.env.TEST_BASE_URL ?? "http://127.0.0.1:5173";

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 }
];

for (const viewport of viewports) {
  test(`${viewport.name} render is stable`, async ({ page }) => {
    const consoleErrors = [];
    const pageErrors = [];

    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.waitForSelector("canvas", { timeout: 15000 });
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `artifacts/${viewport.name}.png`, fullPage: false });
    await page.evaluate(async () => {
      for (const image of Array.from(document.images)) {
        image.scrollIntoView({ block: "center", inline: "nearest" });
        await new Promise((resolve) => window.setTimeout(resolve, 160));
      }

      await Promise.all(
        Array.from(document.images).map((image) => {
          if (image.complete && image.naturalWidth > 0 && image.naturalHeight > 0) {
            return Promise.resolve();
          }

          return image.decode().catch(() => undefined);
        })
      );
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(700);

    const metrics = await page.evaluate(() => {
      const canvas = document.querySelector("canvas");
      const canvasRect = canvas?.getBoundingClientRect();
      const gl = canvas ? canvas.getContext("webgl2") || canvas.getContext("webgl") : null;
      let nonZeroPixels = 0;

      if (gl) {
        const width = Math.min(48, gl.drawingBufferWidth);
        const height = Math.min(48, gl.drawingBufferHeight);
        const x = Math.max(0, Math.floor(gl.drawingBufferWidth / 2 - width / 2));
        const y = Math.max(0, Math.floor(gl.drawingBufferHeight / 2 - height / 2));
        const pixels = new Uint8Array(width * height * 4);
        gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        for (let index = 0; index < pixels.length; index += 4) {
          if (
            pixels[index] !== 0 ||
            pixels[index + 1] !== 0 ||
            pixels[index + 2] !== 0 ||
            pixels[index + 3] !== 0
          ) {
            nonZeroPixels += 1;
          }
        }
      }

      const viewportWidth = document.documentElement.clientWidth;
      const overflowing = Array.from(document.querySelectorAll("body *"))
        .map((node) => {
          const rect = node.getBoundingClientRect();
          return {
            tag: node.tagName,
            className: typeof node.className === "string" ? node.className : "",
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width)
          };
        })
        .filter((item) => item.width > 0 && (item.left < -2 || item.right > viewportWidth + 2))
        .slice(0, 8);

      const failedImages = Array.from(document.images).filter(
        (image) => !image.complete || image.naturalWidth === 0 || image.naturalHeight === 0
      );

      return {
        title: document.title,
        canvas: canvasRect
          ? {
              cssWidth: Math.round(canvasRect.width),
              cssHeight: Math.round(canvasRect.height),
              bufferWidth: gl?.drawingBufferWidth ?? 0,
              bufferHeight: gl?.drawingBufferHeight ?? 0,
              nonZeroPixels
            }
          : null,
        overflowing,
        failedImages: failedImages.length
      };
    });

    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
    expect(metrics.title).toContain("Shubodaya Kumar");
    expect(metrics.failedImages).toBe(0);
    expect(metrics.overflowing).toEqual([]);
    expect(metrics.canvas).not.toBeNull();
    expect(metrics.canvas.cssWidth).toBeGreaterThan(300);
    expect(metrics.canvas.cssHeight).toBeGreaterThan(500);
    expect(metrics.canvas.nonZeroPixels).toBeGreaterThan(40);
  });
}
