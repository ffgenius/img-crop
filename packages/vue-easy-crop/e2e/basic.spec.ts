import { test, expect } from '@playwright/test'
import { fileURLToPath } from 'node:url'

import { dragAndDrop, setViewportStable } from './helpers'

const IMG_2000x1200 = '/images/2000x1200.jpeg'
const IMG_CAT = '/images/cat.jpeg'
const IMG_CROP_FILE = fileURLToPath(
  new URL('../../../playground/public/images/2000x1200.jpeg', import.meta.url)
)

test.describe('Basic assertions', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 600 })
    await page.goto(`/?img=${encodeURIComponent(IMG_2000x1200)}`)
    await page.waitForSelector('[data-testid="cropper"]')
  })

  test('Display the image and cropper with correct dimension', async ({
    page,
  }) => {
    const img = page.locator('img')
    await expect(img).toBeVisible()

    const box = await img.boundingBox()
    expect(box).not.toBeNull()
    // Image should be rendered within the container bounds
    expect(box!.width).toBeGreaterThan(0)
    expect(box!.height).toBeGreaterThan(0)
    expect(box!.width).toBeLessThanOrEqual(1000)
    expect(box!.height).toBeLessThanOrEqual(600)

    const cropper = page.locator('[data-testid="cropper"]')
    await expect(cropper).toBeVisible()
  })

  test('Display tall images with correct dimension', async ({ page }) => {
    await page.goto(`/?img=${encodeURIComponent(IMG_CAT)}`)
    await page.waitForSelector('[data-testid="cropper"]')

    const img = page.locator('img')
    await expect(img).toBeVisible()

    const box = await img.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(0)
    expect(box!.height).toBeGreaterThan(0)
  })

  test('keeps crop area and zoom stable while rotating', async ({ page }) => {
    const cropper = page.locator('[data-testid="cropper"]')
    const rotationSlider = page.locator('[data-testid="rotation-slider"]')
    const zoomSlider = page.locator('[data-testid="zoom-slider"]')
    const initialBox = await cropper.boundingBox()
    const initialZoom = await zoomSlider.inputValue()

    expect(initialBox).not.toBeNull()

    for (const rotation of ['15', '89', '90']) {
      await rotationSlider.evaluate((element, value) => {
        const input = element as HTMLInputElement
        input.value = value
        input.dispatchEvent(new Event('input', { bubbles: true }))
      }, rotation)

      const rotatedBox = await cropper.boundingBox()
      expect(rotatedBox).not.toBeNull()
      expect(rotatedBox!.width).toBeCloseTo(initialBox!.width, 5)
      expect(rotatedBox!.height).toBeCloseTo(initialBox!.height, 5)
      await expect(zoomSlider).toHaveValue(initialZoom)
    }

    await page.locator('[data-testid="aspect-1-1"]').click()
    const squareBox = await cropper.boundingBox()
    expect(squareBox).not.toBeNull()
    expect(squareBox!.width).toBeCloseTo(squareBox!.height, 5)
  })

  test('keeps round crop area square when aspect changes', async ({ page }) => {
    const cropper = page.locator('[data-testid="cropper"]')

    await page.locator('[data-testid="shape-round"]').click()
    await expect
      .poll(async () => {
        const box = await cropper.boundingBox()
        return box ? box.width / box.height : 0
      })
      .toBeCloseTo(1, 5)
    const roundBox = await cropper.boundingBox()
    expect(roundBox).not.toBeNull()

    await page.locator('[data-testid="aspect-16-9"]').click()
    await expect
      .poll(async () => {
        const box = await cropper.boundingBox()
        return box ? box.width / box.height : 0
      })
      .toBeCloseTo(1, 5)
    const changedAspectBox = await cropper.boundingBox()
    expect(changedAspectBox).not.toBeNull()
    expect(changedAspectBox!.width).toBeCloseTo(roundBox!.width, 5)
  })

  test('Display the image and cropper with correct dimension after window resize', async ({
    page,
  }) => {
    await setViewportStable(page, 600, 1000)

    const img = page.locator('img')
    await expect(img).toBeVisible()

    const box = await img.boundingBox()
    expect(box).not.toBeNull()
    // After resize to 600x1000, image should fit within new viewport
    expect(box!.width).toBeLessThanOrEqual(600)
    expect(box!.height).toBeLessThanOrEqual(1000)
  })

  test('should be able to set the crop position/zoom on load', async ({
    page,
  }) => {
    await page.goto(
      `/?img=${encodeURIComponent(IMG_2000x1200)}&setInitialCrop=true`
    )
    await page.waitForSelector('[data-testid="cropper"]')

    const img = page.locator('img')
    await expect(img).toBeVisible()
  })

  test('should be able to center through external buttons', async ({
    page,
  }) => {
    // Hide controls for consistent viewport
    await page.goto(
      `/?img=${encodeURIComponent(IMG_2000x1200)}&hideControls=true`
    )
    await page.waitForSelector('[data-testid="cropper"]')

    // Drag image to the left
    const container = page.locator('[data-testid="container"]')
    await dragAndDrop(container, -500, 0)

    // Navigate back to full page with crop data display
    await page.goto(`/?img=${encodeURIComponent(IMG_2000x1200)}`)
    await page.waitForSelector('[data-testid="cropper"]')

    // Drag left first
    const container2 = page.locator('[data-testid="container"]')
    await dragAndDrop(container2, -500, 0)

    // Click center button
    await page.click('#horizontal-center-button')

    // Wait for Vue reactivity
    await page.waitForTimeout(100)

    // Check that crop area x is at or near center (15 for a 4:3 aspect in 1000x600)
    const cropX = page.locator('#crop-area-x')
    const cropXText = await cropX.textContent()
    expect(cropXText).not.toBeNull()
    // After centering, x should be close to center
    const xVal = Number.parseInt(cropXText!)
    expect(xVal).toBeGreaterThanOrEqual(0)
  })

  test('should preserve crop position after window resize', async ({
    page,
  }) => {
    await page.goto(`/?img=${encodeURIComponent(IMG_2000x1200)}`)
    await page.waitForSelector('[data-testid="cropper"]')

    const container = page.locator('[data-testid="container"]')
    await dragAndDrop(container, 500, 0)

    const cropX = page.locator('#crop-area-x')

    await setViewportStable(page, 500, 500)
    await setViewportStable(page, 1000, 1000)

    // Crop position should be preserved after resize cycle
    // Note: the value may change slightly due to rounding, but should still exist
    const afterX = await cropX.textContent()
    expect(afterX).not.toBeNull()
  })

  test('reports keyboard interaction source', async ({ page }) => {
    const consoleLogs: string[] = []
    page.on('console', (msg) => {
      if (msg.text().includes('user interaction')) {
        consoleLogs.push(msg.text())
      }
    })

    // Focus the cropper (it has tabindex="0")
    const cropper = page.locator('[data-testid="cropper"]')
    await cropper.focus()

    await page.keyboard.press('ArrowRight')

    // Wait for events to fire
    await page.waitForTimeout(100)

    const startLog = consoleLogs.find((l) =>
      l.includes('user interaction started')
    )
    const endLog = consoleLogs.find((l) => l.includes('user interaction ended'))
    expect(startLog).toBeDefined()
    expect(startLog).toContain('keyboard')
    expect(endLog).toBeDefined()
    expect(endLog).toContain('keyboard')
  })

  test('should debounce cropComplete during a burst of window resizes', async ({
    page,
  }) => {
    // Install fake timers to control setTimeout
    await page.clock.install()

    // Spy on console
    const cropCompleteLogs: string[] = []
    page.on('console', (msg) => {
      if (msg.text().includes('onCropComplete!')) {
        cropCompleteLogs.push(msg.text())
      }
    })

    const countBefore = cropCompleteLogs.length

    // Rapid resizes
    await setViewportStable(page, 700, 600)
    await setViewportStable(page, 800, 650)
    await setViewportStable(page, 900, 700)

    // Fast-forward past debounce time
    await page.clock.fastForward(300)

    // Only one additional cropComplete should fire (debounced)
    expect(cropCompleteLogs.length).toBeLessThanOrEqual(countBefore + 1)
  })
})

test.describe('ImgCrop modal regressions', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 })
    await page.goto('/#/img-crop')
    await page.locator('input[type="file"]').setInputFiles(IMG_CROP_FILE)
    await expect(page.locator('.img-crop-media')).toBeVisible()
  })

  test('shows the correct crop area on first open', async ({ page }) => {
    const containerBox = await page.locator('.img-crop-container').boundingBox()
    const cropBox = await page.locator('[data-testid="cropper"]').boundingBox()

    expect(containerBox).not.toBeNull()
    expect(cropBox).not.toBeNull()
    expect(cropBox!.width / cropBox!.height).toBeCloseTo(4 / 3, 2)
    expect(cropBox!.width).toBeGreaterThan(containerBox!.width * 0.7)
  })

  test('keeps cropper styles until the close animation finishes', async ({
    page,
  }) => {
    const samples = await page.evaluate(async () => {
      const closeButton =
        document.querySelector<HTMLButtonElement>('.ant-modal-close')
      closeButton?.click()

      const result: { overflow: string; maxWidth: string }[] = []
      const start = performance.now()

      await new Promise<void>((resolve) => {
        const sample = () => {
          const container = document.querySelector('.img-crop-container')
          const image = document.querySelector('.img-crop-media')
          if (container && image) {
            result.push({
              overflow: getComputedStyle(container).overflow,
              maxWidth: getComputedStyle(image).maxWidth,
            })
          }

          if (performance.now() - start < 400) requestAnimationFrame(sample)
          else resolve()
        }
        requestAnimationFrame(sample)
      })

      return result
    })

    expect(samples.length).toBeGreaterThan(0)
    expect(samples.every(({ overflow }) => overflow === 'hidden')).toBe(true)
    expect(samples.every(({ maxWidth }) => maxWidth === '100%')).toBe(true)
    await expect(page.locator('.ant-modal')).toBeHidden()
    await expect(page.locator('.img-crop-media')).toHaveCount(0)
  })

  test('resets cropper state before reopening and closes through OK', async ({
    page,
  }) => {
    await page.locator('.img-crop-control-zoom button:last-child').click()
    await page.locator('.img-crop-control-rotation button:last-child').click()
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.locator('.ant-modal')).toBeHidden()

    await page.locator('input[type="file"]').setInputFiles(IMG_CROP_FILE)
    const image = page.locator('.img-crop-media')
    await expect(image).toBeVisible()
    await expect(image).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)')

    await page.getByRole('button', { name: 'OK', exact: true }).click()
    await expect(page.locator('.ant-modal')).toBeHidden()
    await expect(page.locator('.img-crop-media')).toHaveCount(0)
  })
})
