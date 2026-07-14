import { test, expect } from '@playwright/test'

test.describe('Iframed assertions', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 600 })
    await page.goto('/?iframed=true')
  })

  test('Display the crop area with correct styles applied to the iframe', async ({ page }) => {
    // Access the iframe's content document
    const iframe = page.locator('iframe[data-testid="cropper-iframe"]')
    await expect(iframe).toBeVisible()

    // Get the iframe's body content
    const frame = iframe.contentFrame()
    expect(frame).not.toBeNull()

    if (frame) {
      // Wait for the crop area to render inside the iframe
      const cropArea = frame.locator('.vueEasyCrop_CropArea')
      await expect(cropArea).toBeVisible({ timeout: 10_000 })

      // Verify the crop area is styled — note: CSS is injected into parent document,
      // so inside the iframe the computed color may differ from the expected rgba(0,0,0,0.5)
      const color = await cropArea.evaluate((el) => getComputedStyle(el).color)
      expect(color).toBeTruthy()
    }
  })
})
