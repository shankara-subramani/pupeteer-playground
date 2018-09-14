// *********************************************************
// uses puppeteer to login to irctc and book tickets 🚧
// *********************************************************
const puppeteer = require('puppeteer');
const terminalImage = require('terminal-image');
const got = require('got');
const inquirer = require('inquirer');
const CREDS = require('../creds');

(async () => {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.goto('https://www.irctc.co.in/nget/train-search', {
		waitUntil: 'networkidle2'
	});
	await page.setViewport({
		width: 1280,
		height: 800
	});
// ***********************SIGN IN****************************

	// *********************//selectors//*************************
	const captchaContainer = '#nlpCaptchaContainer';
	const captchaSel = 'img#captchaImg';
	const captchaAnsSel = 'input#nlpAnswer';
	const captchaSubmit =
		'#login_header_disable > div > div.ui-dialog-content.ui-widget-content > app-login > div.irmodal > div > div.login-bg.text-center.pull-left > div.modal-content > div.modal-body > form > button';

	const usernameSel = 'input#userId';
	const pwdSel = 'input#pwd';

	// *********************//actions//*************************
	//=> click hamburger
	await page.click('.h_menu_drop_button.hidden-xs');
	await page.click('#slide-menu > p-sidebar > div > nav > div > label > span');
	//=>type username
	await page.waitForSelector(usernameSel);
	await page.type(usernameSel, CREDS.irctcUn);
	//=>type password
	await page.waitForSelector(pwdSel);
	await page.type(pwdSel, CREDS.irctcPwd);
	//=>get captcha url
	await page.waitForSelector(captchaContainer);
	await page.waitForSelector(captchaSel);
	getCaptchaImg = await page.$eval(captchaSel, el => el.src);
	//=>render in console using terminalImage
	const { body } = await got(getCaptchaImg, { encoding: null });
	console.log(await terminalImage.buffer(body));
	//=>ask user to enter captcha using inquirer and click 'submit'
	async function run() {
		let answer = await inquirer.prompt([
			{
				type: 'input',
				name: 'captcha',
				message: 'captcha please'
			}
		]);
		await page.waitForSelector(captchaAnsSel);
		await page.type(captchaAnsSel, answer.captcha);
	}
	let x = await run();
	await page.click(captchaSubmit);

// ***********************TRAIN SEARCH****************************

	// *********************//selectors//*************************
	const fromSel = '#origin > span > input';
	const toSel = '#destination > span > input';
	const dateSel = 'p-calendar > span.ui-calendar > input';
	const submitSel = 'button.search_btn';

	// *********************//actions//*************************
	const from = 'TIRUCHCHIRAPALI - TPJ';
	const to = 'CHENNAI EGMORE - MS';
	const date = '15-10-2018';
	//=>type from station
	await page.waitForSelector(fromSel);
	await page.type(fromSel, from);
	//=>type to station
	await page.waitForSelector(toSel);
	await page.type(toSel, to);
	//=> press tab to escape the dateSel
	await page.keyboard.press('Tab');
	//=>select date
	await page.waitForSelector(dateSel);
	await page.type(dateSel, date);
	//=> press tab again to escape the dateSel
	await page.keyboard.press('Tab');
	//=>click submit
	await page.click(submitSel);
	//=>wait for page navigation
	await page.waitForNavigation();
	//=>take a screenshot
	await page.screenshot({ path: `screengrab_${Date.now()}.png`, fullPage: 0 });
	//=>log completion
	console.log('all done ⚡️');

	await browser.close();
})();
