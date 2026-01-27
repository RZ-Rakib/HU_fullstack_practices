const loginWith = async(page, username, password) => {
  await page.getByRole('button', { name: /log in/i }).click()
  await page.getByLabel(/username/i).fill(username)
  await page.getByLabel(/password/i).fill(password)
  await page.getByRole('button', { name: /login/i }).click()
}

export { loginWith }