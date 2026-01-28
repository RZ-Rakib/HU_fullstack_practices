const loginWith = async(page, username, password) => {
  await page.getByRole('button', { name: /log in/i }).click()
  await page.getByLabel(/username/i).fill(username)
  await page.getByLabel(/password/i).fill(password)
  await page.getByRole('button', { name: /login/i }).click()
}

const createNote = async(page, content) => {
  await page.getByRole('button', { name: /new note/i }).click()
  await page.getByPlaceholder(/enter a new note/i).fill(content)
  await page.getByRole('button', { name: /save/i }).click()
}

export { loginWith, createNote }