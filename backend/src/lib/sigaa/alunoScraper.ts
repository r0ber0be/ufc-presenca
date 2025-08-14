import { Browser, Page } from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

puppeteer.use(StealthPlugin())
const baseUrl = 'https://si3.ufc.br/sigaa'

export async function studentSigaaLogin(login: string, password: string) {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  await page.goto(`${baseUrl}`)
  await page.waitForNetworkIdle()

  await page.type('td > input[type=text]', login)
  await page.type('td > input[type=password]', password)

  login = ''
  password = ''

  await checkAndProceed(
    page,
    browser,
    '/verTelaLogin.do',
    'td > input[type=submit]',
  )

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
    '#btnNaoResponderContinuar',
    '#btnSimLembrarQuestionario',
  )
  // Pular a página de avisos
  await checkAndProceed(
    page,
    browser,
    '/telaAvisoLogon.jsf',
    'div > input[type=submit]',
  )

  await page.waitForNavigation()
  await page.waitForNetworkIdle()

  // Entrar na página do discente
  await checkAndProceed(
    page,
    browser,
    '/paginaInicial.do',
    '#portais > ul > li.discente.on > a',
  )

  await page.waitForNetworkIdle()

  const registrationNumber = await evaluatePage(
    page,
    '#agenda-docente > table > tbody > tr:nth-child(1) > td:nth-child(2)',
  )

  const name = await evaluatePage(
    page,
    '#perfil-docente > p.info-docente > span > small > b',
  )
  console.log(registrationNumber, name)

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
  }
}

async function checkAndProceed(
  page: Page,
  browser: Browser,
  pathname: string,
  selector: string,
  selector2?: string,
) {
  const expectedPathname = `${baseUrl}${pathname}`
  const actualPathname = page.url().split(';')[0]
  console.log(expectedPathname, actualPathname)

  if (actualPathname === expectedPathname) {
    await Promise.all([
      page.waitForNavigation(),
      page.click(selector),
      selector2 ? page.click(selector2) : '',
    ])
  } else {
    browser.close()
    throw new Error('Não foi possível acessar a rota do discente.')
  }
}

async function evaluatePage(page: Page, selector: string) {
  return await page.evaluate((sel) => {
    return document.querySelector(sel)?.textContent?.trim() || null
  }, selector)
}
