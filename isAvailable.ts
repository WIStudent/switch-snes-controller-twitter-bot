import puppeteer from 'puppeteer-core';

const URL = 'https://mynintendostore.nintendo.de/super-nintendo-entertainment-system-controller-for-nintendo-switch.html';
const NOT_AVAILIABLE_TEXT = 'Derzeit nicht verfügbar';

export default async () => {
  const browser = await puppeteer.launch({executablePath: process.env.EXEC_PATH});
  try {
    const page = await browser.newPage();
    await page.goto(URL);
    const available = await page.evaluate(
      notAvailableText => document.querySelector<HTMLElement>('.requires-coupon')?.innerText !== notAvailableText,
      NOT_AVAILIABLE_TEXT
    );
    return available;
  } finally {
    await browser.close();
  }
};
