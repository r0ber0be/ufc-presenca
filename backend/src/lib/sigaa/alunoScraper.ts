import { Browser, Page } from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

puppeteer.use(StealthPlugin())
const baseUrl = 'https://si3.ufc.br/sigaa'

export async function studentSigaaLogin(login: string, password: string) {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  page.on('console', (message) => {
    console.log('SIGAA PAGE:', message.text())
  })

  await page.goto(`${baseUrl}`)
  await page.waitForNetworkIdle()

  await page.type('td > input[type=text]', login)
  await page.type('td > input[type=password]', password)

  login = ''
  password = ''

  await checkAndProceed(page, browser, '/verTelaLogin.do', [
    'td > input[type=submit]',
  ])

  await page.waitForNetworkIdle()

  const loginError = await page.$(
    '#conteudo > table > tbody > tr > td > center',
  )

  if (loginError) {
    const text = await page.evaluate((el) => el.textContent, loginError)
    if (text.includes('Usuário e/ou senha inválidos')) {
      browser.close()
      throw new Error('Usuário e/ou senha inválidos')
    }
    browser.close()
    throw new Error('Login inválido')
  }

  // Pular a página de questionários
  await checkAndProceed(
    page,
    browser,
    '/questionarios.jsf',
    ['#btnNaoResponderContinuar', '#btnSimLembrarQuestionario'],
    { optional: true },
  )
  // Pular a página de avisos
  await checkAndProceed(
    page,
    browser,
    '/telaAvisoLogon.jsf',
    ['div > input[type=submit]'],
    { optional: true },
  )

  await page.waitForNetworkIdle()

  // Entrar na página do discente
  await checkAndProceed(page, browser, '/paginaInicial.do', [
    '#portais > ul > li.discente.on > a',
  ])

  await page.waitForNetworkIdle()

  const registrationNumber = await evaluatePage(
    page,
    '#agenda-docente > table > tbody > tr:nth-child(1) > td:nth-child(2)',
  )

  const name = await evaluatePage(
    page,
    '#perfil-docente > p.info-docente > span > small > b',
  )
  const classCodes = await collectClassCodes(page)
  console.log(registrationNumber, name, classCodes)

  if (!name || !registrationNumber) {
    browser.close()
    throw new Error(
      'Os dados necessários não foram encontrados. Tente novamente.',
    )
  }

  browser.close()

  return {
    name,
    registrationNumber,
    classCodes,
  }
}

async function checkAndProceed(
  page: Page,
  browser: Browser,
  pathname: string,
  selectors: string[],
  options: { optional?: boolean } = {},
) {
  const expectedPathname = `${baseUrl}${pathname}`
  const actualPathname = page.url().split(';')[0]
  console.log(expectedPathname, actualPathname)

  if (actualPathname !== expectedPathname) {
    if (options.optional) {
      return false
    }
    browser.close()
    throw new Error('Não foi possível acessar a rota do discente.')
  }

  const didClick = await clickFirstAvailable(page, selectors)
  if (!didClick) {
    if (options.optional) {
      return false
    }
    browser.close()
    throw new Error('Não foi possível localizar o botão esperado.')
  }
  return true
}

async function evaluatePage(page: Page, selector: string) {
  return await page.evaluate((sel) => {
    return document.querySelector(sel)?.textContent?.trim() || null
  }, selector)
}

async function clickFirstAvailable(page: Page, selectors: string[]) {
  for (const selector of selectors) {
    const handle = await page.$(selector)
    if (handle) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => null),
        page.click(selector),
      ])
      return true
    }
  }
  return false
}

async function collectClassCodes(page: Page) {
  await page
    .waitForSelector('#turmas-portal a[id*="turmaVirtual"]', { timeout: 7000 })
    .catch(() => {})

  const items = await page.evaluate(() => {
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        '#turmas-portal a[id*="turmaVirtual"]',
      ),
    )

    return links.map((a) => ({
      text: (a.textContent || '').replace(/\s+/g, ' ').trim(),
      href: a.href || '',
    }))
  })

  const re = /QXD[\s-]*\d{4,5}/i

  const fromLinks = items
    .map((x) => {
      const m = (x.text + ' ' + x.href).match(re)?.[0] ?? null
      return m ? m.replace(/\s|-/g, '').toUpperCase() : null // normaliza p/ "QXD1234"
    })
    .filter((x): x is string => Boolean(x))

  if (fromLinks.length > 0) {
    return Array.from(new Set(fromLinks))
  }

  // 3) fallback no body (também mais tolerante)
  const bodyText = await page.evaluate(() => document.body?.textContent || '')
  const fallback = (bodyText.match(/QXD[\s-]*\d{4,5}/gi) || []).map((x) =>
    x.replace(/\s|-/g, '').toUpperCase(),
  )

  return Array.from(new Set(fallback))
}
