// *********************************************************
// uses puppeteer to login to twitter and take screenshot
// *********************************************************
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://twitter.com/login', {waitUntil: 'networkidle2'});
  await page.setViewport({
    width: 1280,
    height: 800
  });

  const usernameSel = '#page-container > div > div.signin-wrapper > form > fieldset > div:nth-child(2) > input'

  const passSel = '#page-container > div > div.signin-wrapper > form > fieldset > div:nth-child(3) > input'

  const submitSel = '#page-container > div > div.signin-wrapper > form > div.clearfix > button'

  const username = 'xxx'
  const password = 'xxx'

  //type username
  await page.waitForSelector(usernameSel)
  await page.type(usernameSel, username);
  //type password
  await page.waitForSelector(passSel)
  await page.type(passSel, password);
  //click submit
  await page.waitForSelector(submitSel)
  await page.click(submitSel);
  //wait for page navigation
  await page.waitForNavigation();
  //take a screenshot
  await page.screenshot({path: 'twitterHD.png', fullPage: 0});
  //log completion
  console.log('all done ⚡️')

  await browser.close();
})();
