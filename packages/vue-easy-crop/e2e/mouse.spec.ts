import { test, expect } from '@playwright/test'

import { dragAndDrop } from './helpers'

test.describe('Mouse assertions', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 600 })
    await page.goto('/?hideControls=true')
    await page.waitForSelector('[data-testid="cropper"]')
  })

  test('Move the image with mouse', async ({ page }) => {
    const consoleLogs: string[] = []
    page.on('console', (msg) => {
      if (msg.text().includes('user interaction')) {
        consoleLogs.push(msg.text())
      }
    })

    const container = page.locator('[data-testid="container"]')
    await dragAndDrop(container, 50, 0)

    // Wait for RAF to complete
    await page.waitForTimeout(50)

    const startLog = consoleLogs.find((l) => l.includes('started'))
    const endLog = consoleLogs.find((l) => l.includes('ended'))
    expect(startLog).toBeDefined()
    expect(startLog).toContain('mouse')
    expect(endLog).toBeDefined()
    expect(endLog).toContain('mouse')
  })

  test('Limit the left drag if too far', async ({ page }) => {
    const container = page.locator('[data-testid="container"]')
    await dragAndDrop(container, -1000, 0)

    // Image should not be dragged out of bounds — crop area should still be visible
    const cropper = page.locator('[data-testid="cropper"]')
    await expect(cropper).toBeVisible()
  })

  test('Limit the right drag if too far', async ({ page }) => {
    const container = page.locator('[data-testid="container"]')
    await dragAndDrop(container, 1000, 0)

    const cropper = page.locator('[data-testid="cropper"]')
    await expect(cropper).toBeVisible()
  })

  test('Mouse wheel should zoom in and out', async ({ page }) => {
    const consoleLogs: string[] = []
    page.on('console', (msg) => {
      if (msg.text().includes('user interaction')) {
        consoleLogs.push(msg.text())
      }
    })

    const container = page.locator('[data-testid="container"]')
    const box = await container.boundingBox()
    if (!box) throw new Error('Container not visible')

    const cx = box.x + box.width / 2
    const cy = box.y + box.height / 2

    // Zoom in (deltaY negative)
    await page.mouse.move(cx, cy)
    await page.mouse.wheel(0, -100)

    const startLog = consoleLogs.find((l) => l.includes('started'))
    expect(startLog).toBeDefined()
    expect(startLog).toContain('wheel')

    // Zoom out (deltaY positive)
    await page.mouse.move(cx, cy)
    await page.mouse.wheel(0, 50)
  })

  test('Mouse wheel should zoom in and out following the pointer', async ({
    page,
  }) => {
    const container = page.locator('[data-testid="container"]')
    const box = await container.boundingBox()
    if (!box) throw new Error('Container not visible')

    // Zoom in at top-left
    await page.mouse.move(box.x, box.y)
    await page.mouse.wheel(0, -100)

    await page.waitForTimeout(50)

    // Zoom out at bottom-right
    await page.mouse.move(box.x + box.width, box.y + box.height)
    await page.mouse.wheel(0, 50)
  })

  test('Move down and right after zoom', async ({ page }) => {
    const container = page.locator('[data-testid="container"]')
    const box = await container.boundingBox()
    if (!box) throw new Error('Container not visible')

    const cx = box.x + box.width / 2
    const cy = box.y + box.height / 2

    // Zoom in
    await page.mouse.move(cx, cy)
    await page.mouse.wheel(0, -100)
    await page.waitForTimeout(50)

    // Drag down and right
    await dragAndDrop(container, 50, 50)
  })

  test('Move up and left after zoom', async ({ page }) => {
    const container = page.locator('[data-testid="container"]')
    const box = await container.boundingBox()
    if (!box) throw new Error('Container not visible')

    const cx = box.x + box.width / 2
    const cy = box.y + box.height / 2

    // Zoom in
    await page.mouse.move(cx, cy)
    await page.mouse.wheel(0, -100)
    await page.waitForTimeout(50)

    // Drag up and left
    await dragAndDrop(container, -50, -50)
  })

  test('Limit top after zoom', async ({ page }) => {
    const container = page.locator('[data-testid="container"]')
    const box = await container.boundingBox()
    if (!box) throw new Error('Container not visible')

    const cx = box.x + box.width / 2
    const cy = box.y + box.height / 2

    // Zoom in
    await page.mouse.move(cx, cy)
    await page.mouse.wheel(0, -100)
    await page.waitForTimeout(50)

    // Try to drag too far up
    await dragAndDrop(container, 0, -1000)

    const cropper = page.locator('[data-testid="cropper"]')
    await expect(cropper).toBeVisible()
  })

  test('Limit bottom after zoom', async ({ page }) => {
    const container = page.locator('[data-testid="container"]')
    const box = await container.boundingBox()
    if (!box) throw new Error('Container not visible')

    const cx = box.x + box.width / 2
    const cy = box.y + box.height / 2

    // Zoom in
    await page.mouse.move(cx, cy)
    await page.mouse.wheel(0, -100)
    await page.waitForTimeout(50)

    // Try to drag too far down
    await dragAndDrop(container, 0, 1000)

    const cropper = page.locator('[data-testid="cropper"]')
    await expect(cropper).toBeVisible()
  })

  test('Keep image under crop area after zoom out', async ({ page }) => {
    const container = page.locator('[data-testid="container"]')
    const box = await container.boundingBox()
    if (!box) throw new Error('Container not visible')

    const cx = box.x + box.width / 2
    const cy = box.y + box.height / 2

    // Zoom in
    await page.mouse.move(cx, cy)
    await page.mouse.wheel(0, -100)
    await page.waitForTimeout(50)

    // Drag to bottom
    await dragAndDrop(container, 0, 500)
    await page.waitForTimeout(50)

    // Zoom out
    await page.mouse.move(cx, cy)
    await page.mouse.wheel(0, 100)

    const cropper = page.locator('[data-testid="cropper"]')
    await expect(cropper).toBeVisible()
  })
})
