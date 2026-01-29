const { describe, beforeEach, test, expect } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')


describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Rakib Zaman',
        username: 'rakib',
        password: 'rakib123'
      }
    })

    await page.goto('/')
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
      await createNote(page, 'a new note')
      await expect(page.locator('li')).toContainText(/a new note/i)
    })

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'third note')
      })

      test('one of those can be made nonimportant', async ({ page }) => {
        const oneNoteElement = page.locator('li.note', { hasText: 'second note' })
        await oneNoteElement.getByRole('button', { name: /make not important/i }).click()
        await expect(oneNoteElement.getByRole('button', { name: /make important/i })).toBeVisible()
      })
    })
  })
})

