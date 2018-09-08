// *********************************************************************
// uses puppeteer to go deep into the rabbit hole of YT recommendation
// *********************************************************************
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const file = path.resolve('yt.json');

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('https://youtube.com', { waitUntil: 'networkidle2' });
	await page.setViewport({
		width: 1280,
		height: 800
	});

  // selectors
	const homeItemSel =
		'#items > ytd-grid-video-renderer:nth-child(2) > #dismissable > #details > #meta > h3 > #video-title';

	const nextItemSel =
		'#related > ytd-watch-next-secondary-results-renderer > #items > ytd-compact-autoplay-renderer.ytd-watch-next-secondary-results-renderer:nth-child(1) >  #contents > .ytd-compact-autoplay-renderer > #dismissable > a.yt-simple-endpoint';

	const nextItemTSel = nextItemSel + '> h3 > #video-title';

	await page.waitForSelector(homeItemSel);
	var ytTitle = await page.$eval(homeItemSel, el => el.title);
	var ytLink = await page.$eval(homeItemSel, el => el.href);

	var arr = [{
			instance: 0,
			title: ytTitle,
			link: ytLink
		}];

	for (var i = 0; i < 5; i++) {
    console.log(`instance${i}`);
    console.log(ytTitle);
    console.log(ytLink);

    await page.goto(ytLink, {
			waitUntil: 'networkidle2',
			timeout: 3000000
		});

		await page.waitForSelector(nextItemTSel);
		ytTitle = await page.$eval(nextItemTSel, el => el.title);

		await page.waitForSelector(nextItemSel);
		ytLink = await page.$eval(nextItemSel, el => el.href);

		var obj = {
			instance: i + 1,
			title: ytTitle,
			link: ytLink
		};
		arr.push(obj);
	}
	//log results and completion
	console.log('here comes the json 🔽');
	console.log(JSON.stringify(arr));

  fs.outputJson(file, arr, err => {
    if (err === null) {
      console.log('all done ⚡️');
    }
    else {
      console.log(err)
    }
  })
  //close the browser
	await browser.close();
})();
