import type { Page, Locator } from '@playwright/test'

/**
 * Simulate a mouse drag on an element.
 * Equivalent to Cypress command: cy.get(sel).dragAndDrop({ x, y })
 */
export async function dragAndDrop(locator: Locator, dx: number, dy: number) {
  const box = await locator.boundingBox()
  if (!box) throw new Error('Element not visible for dragAndDrop')

  const startX = box.x + box.width / 2
  const startY = box.y + box.height / 2

  await locator.page().mouse.move(startX, startY)
  await locator.page().mouse.down()
  await locator.page().mouse.move(startX + dx, startY + dy, { steps: 10 })
  await locator.page().mouse.up()
}

/**
 * Simulate a touch drag on an element.
 * Equivalent to Cypress command: cy.get(sel).dragAndDropWithTouch({ x, y })
 */
export async function dragAndDropWithTouch(
  page: Page,
  selector: string,
  dx: number,
  dy: number
) {
  await page.evaluate(
    ({ selector, dx, dy }) => {
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
      const el = document.querySelector(selector)
      if (!el) throw new Error(`Element not found: ${selector}`)

      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2

      el.dispatchEvent(
        new TouchEvent('touchstart', {
          touches: [_ct(el, cx, cy, 0)],
          changedTouches: [_ct(el, cx, cy, 0)],
          bubbles: true,
          cancelable: true,
        })
      )
      el.dispatchEvent(
        new TouchEvent('touchmove', {
          touches: [_ct(el, cx + dx, cy + dy, 0)],
          changedTouches: [_ct(el, cx + dx, cy + dy, 0)],
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
    },
    { selector, dx, dy }
  )
}

/**
 * Simulate a pinch (two-finger) gesture on an element.
 * Equivalent to Cypress command: cy.get(sel).pinch({ distance })
 *
 * distance > 0 = pinch out (zoom in), distance < 0 = pinch in (zoom out)
 */
export async function pinch(page: Page, selector: string, distance: number) {
  await page.evaluate(
    ({ selector, distance }) => {
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
      const el = document.querySelector(selector)
      if (!el) throw new Error(`Element not found: ${selector}`)

      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2

      const finger1X = cx - 5
      const finger2StartX = cx + 5
      const finger2EndX = cx + 5 + distance

      el.dispatchEvent(
        new TouchEvent('touchstart', {
          touches: [_ct(el, finger1X, cy, 0), _ct(el, finger2StartX, cy, 1)],
          changedTouches: [
            _ct(el, finger1X, cy, 0),
            _ct(el, finger2StartX, cy, 1),
          ],
          bubbles: true,
          cancelable: true,
        })
      )
      el.dispatchEvent(
        new TouchEvent('touchmove', {
          touches: [_ct(el, finger1X, cy, 0), _ct(el, finger2EndX, cy, 1)],
          changedTouches: [
            _ct(el, finger1X, cy, 0),
            _ct(el, finger2EndX, cy, 1),
          ],
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
    },
    { selector, distance }
  )
}

/**
 * Simulate a rotation gesture with two fingers on an element.
 * Equivalent to Cypress command: cy.get(sel).rotate({ rotation })
 *
 * rotation in degrees: positive = clockwise, negative = counter-clockwise
 */
export async function rotate(page: Page, selector: string, rotation: number) {
  await page.evaluate(
    ({ selector, rotation }) => {
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
      const el = document.querySelector(selector)
      if (!el) throw new Error(`Element not found: ${selector}`)

      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2

      const radius = 50
      const rotationInRadians = (rotation * Math.PI) / 180

      // Finger 1: fixed at top (12 o'clock), Finger 2: rotates from bottom
      const f1X = cx
      const f1Y = cy - radius
      const f2StartX = cx
      const f2StartY = cy + radius
      const f2EndX = cx + radius * Math.sin(rotationInRadians)
      const f2EndY = cy - radius * Math.cos(rotationInRadians)

      el.dispatchEvent(
        new TouchEvent('touchstart', {
          touches: [_ct(el, f1X, f1Y, 0), _ct(el, f2StartX, f2StartY, 1)],
          changedTouches: [
            _ct(el, f1X, f1Y, 0),
            _ct(el, f2StartX, f2StartY, 1),
          ],
          bubbles: true,
          cancelable: true,
        })
      )
      el.dispatchEvent(
        new TouchEvent('touchmove', {
          touches: [_ct(el, f1X, f1Y, 0), _ct(el, f2EndX, f2EndY, 1)],
          changedTouches: [_ct(el, f1X, f1Y, 0), _ct(el, f2EndX, f2EndY, 1)],
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
    },
    { selector, rotation }
  )
}

/**
 * Set viewport size and wait for the page to stabilize (two animation frames).
 * Equivalent to Cypress command: cy.setViewportStable(width, height)
 */
export async function setViewportStable(
  page: Page,
  width: number,
  height: number
) {
  await page.setViewportSize({ width, height })
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve())
        })
      })
  )
}
