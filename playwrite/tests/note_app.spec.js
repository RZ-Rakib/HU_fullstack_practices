const { describe, beforeEach, test, expect } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')


describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Rakib Zaman',
        username: 'rakib',
        password: 'rakib123'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2025')).toBeVisible()
  })

  test('user can login', async ({ page }) => {
    await loginWith(page, 'rakib', 'rakib123')
    await expect(page.getByText('Rakib Zaman logged in')).toBeVisible()
  })

  test('login fails with wrong credentials', async({ page }) => {
    await loginWith(page, 'rakib', 'rakibws')

    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText(/Wrong credentials/i)
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText(/Rakib Zaman logged in/i)).not.toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'rakib', 'rakib123')
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a new note is created by Playwright created successfully')
      await expect(page.locator('.first-li')).toContainText(/a new note is created by Playwright created successfully/i)
    })

    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'another note by Playwright')
      })

      test('importance can be changed', async ({ page }) => {
        await page.getByRole('button', { name: /make not important/i }).click()
        await expect(page.getByText(/make important/i)).toBeVisible()
      })
    })
  })
})

