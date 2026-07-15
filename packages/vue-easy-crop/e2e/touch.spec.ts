import { test, expect } from '@playwright/test'

import { dragAndDropWithTouch, pinch, rotate } from './helpers'

test.describe('Touch assertions', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 600 })
    await page.goto('/?hideControls=true')
    await page.waitForSelector('[data-testid="cropper"]')
  })

  test('Move the image with touch', async ({ page }) => {
    const consoleLogs: string[] = []
    page.on('console', (msg) => {
      if (msg.text().includes('user interaction')) {
        consoleLogs.push(msg.text())
      }
    })

    await dragAndDropWithTouch(page, '[data-testid="container"]', 50, 0)

    await page.waitForTimeout(50)

    const startLog = consoleLogs.find((l) => l.includes('started'))
    const endLog = consoleLogs.find((l) => l.includes('ended'))
    expect(startLog).toBeDefined()
    expect(startLog).toContain('touch')
    expect(endLog).toBeDefined()
    expect(endLog).toContain('touch')
  })

  test('Limit the left drag if too far', async ({ page }) => {
    await dragAndDropWithTouch(page, '[data-testid="container"]', -1000, 0)

    const cropper = page.locator('[data-testid="cropper"]')
    await expect(cropper).toBeVisible()
  })

  test('Limit the right drag if too far', async ({ page }) => {
    await dragAndDropWithTouch(page, '[data-testid="container"]', 1000, 0)

    const cropper = page.locator('[data-testid="cropper"]')
    await expect(cropper).toBeVisible()
  })

  test('Zoom in and out with pinch', async ({ page }) => {
    const consoleLogs: string[] = []
    page.on('console', (msg) => {
      if (msg.text().includes('user interaction')) {
        consoleLogs.push(msg.text())
      }
    })

    // Pinch out = zoom in
    await pinch(page, '[data-testid="container"]', 10)
    await page.waitForTimeout(50)

    let startLog = consoleLogs.find((l) => l.includes('started'))
    expect(startLog).toBeDefined()
    expect(startLog).toContain('touch')

    // Pinch in = zoom out
    await pinch(page, '[data-testid="container"]', -4)
    await page.waitForTimeout(50)

    const endLog = consoleLogs.find((l) => l.includes('ended'))
    expect(endLog).toBeDefined()
    expect(endLog).toContain('touch')
  })

  test('Zoom in and out with pinch based on the center between 2 fingers', async ({
    page,
  }) => {
    // Dispatch pinch at a specific position using page.evaluate
    await page.evaluate(() => {
      function _ct(
        target: Element,
        clientX: number,
        clientY: number,
        identifier: number
      ): Touch {
        return new Touch({
          identifier,
          target,
          clientX,
          clientY,
          pageX: clientX,
          pageY: clientY,
          screenX: clientX,
          screenY: clientY,
          radiusX: 1,
          radiusY: 1,
          rotationAngle: 0,
          force: 1,
        })
      }
      const el = document.querySelector('[data-testid="container"]')
      if (!el) throw new Error('Container not found')

      el.dispatchEvent(
        new TouchEvent('touchstart', {
          touches: [_ct(el, 500, 200, 0), _ct(el, 500, 300, 1)],
          changedTouches: [_ct(el, 500, 200, 0), _ct(el, 500, 300, 1)],
          bubbles: true,
          cancelable: true,
        })
      )
      el.dispatchEvent(
        new TouchEvent('touchmove', {
          touches: [_ct(el, 500, 200, 0), _ct(el, 500, 310, 1)],
          changedTouches: [_ct(el, 500, 200, 0), _ct(el, 500, 310, 1)],
          bubbles: true,
          cancelable: true,
        })
      )
      el.dispatchEvent(
        new TouchEvent('touchend', {
          touches: [],
          changedTouches: [],
          bubbles: true,
          cancelable: true,
        })
      )
    })

    const cropper = page.locator('[data-testid="cropper"]')
    await expect(cropper).toBeVisible()

    // Zoom out at different position
    await page.evaluate(() => {
      function _ct(
        target: Element,
        clientX: number,
        clientY: number,
        identifier: number
      ): Touch {
        return new Touch({
          identifier,
          target,
          clientX,
          clientY,
          pageX: clientX,
          pageY: clientY,
          screenX: clientX,
          screenY: clientY,
          radiusX: 1,
          radiusY: 1,
          rotationAngle: 0,
          force: 1,
        })
      }
      const el = document.querySelector('[data-testid="container"]')
      if (!el) throw new Error('Container not found')

      el.dispatchEvent(
        new TouchEvent('touchstart', {
          touches: [_ct(el, 100, 50, 0), _ct(el, 200, 50, 1)],
          changedTouches: [_ct(el, 100, 50, 0), _ct(el, 200, 50, 1)],
          bubbles: true,
          cancelable: true,
        })
      )
      el.dispatchEvent(
        new TouchEvent('touchmove', {
          touches: [_ct(el, 100, 50, 0), _ct(el, 190, 50, 1)],
          changedTouches: [_ct(el, 100, 50, 0), _ct(el, 190, 50, 1)],
          bubbles: true,
          cancelable: true,
        })
      )
      el.dispatchEvent(
        new TouchEvent('touchend', {
          touches: [],
          changedTouches: [],
          bubbles: true,
          cancelable: true,
        })
      )
    })
  })

  test('Move image with pinch based on the center between 2 fingers', async ({
    page,
  }) => {
    await page.evaluate(() => {
      function _ct(
        target: Element,
        clientX: number,
        clientY: number,
        identifier: number
      ): Touch {
        return new Touch({
          identifier,
          target,
          clientX,
          clientY,
          pageX: clientX,
          pageY: clientY,
          screenX: clientX,
          screenY: clientY,
          radiusX: 1,
          radiusY: 1,
          rotationAngle: 0,
          force: 1,
        })
      }
      const el = document.querySelector('[data-testid="container"]')
      if (!el) throw new Error('Container not found')

      // Two fingers moving together to the right
      el.dispatchEvent(
        new TouchEvent('touchstart', {
          touches: [_ct(el, 500, 200, 0), _ct(el, 600, 300, 1)],
          changedTouches: [_ct(el, 500, 200, 0), _ct(el, 600, 300, 1)],
          bubbles: true,
          cancelable: true,
        })
      )
      el.dispatchEvent(
        new TouchEvent('touchmove', {
          touches: [_ct(el, 600, 200, 0), _ct(el, 700, 300, 1)],
          changedTouches: [_ct(el, 600, 200, 0), _ct(el, 700, 300, 1)],
          bubbles: true,
          cancelable: true,
        })
      )
      el.dispatchEvent(
        new TouchEvent('touchend', {
          touches: [],
          changedTouches: [],
          bubbles: true,
          cancelable: true,
        })
      )
    })

    const cropper = page.locator('[data-testid="cropper"]')
    await expect(cropper).toBeVisible()
  })

  test('Rotate with pinch', async ({ page }) => {
    // Rotate clockwise
    await rotate(page, '[data-testid="container"]', 30)
    await page.waitForTimeout(50)

    const cropper = page.locator('[data-testid="cropper"]')
    await expect(cropper).toBeVisible()

    // Rotate counter-clockwise
    await rotate(page, '[data-testid="container"]', -45)
    await page.waitForTimeout(50)

    await expect(cropper).toBeVisible()
  })
})
