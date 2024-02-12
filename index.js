// write code with puppeteer-core to screenshot and send image using express
const express = require('express');
const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.get('/screenshot', async (req, res) => {
    const weburl = req.query.url;
    const browser = await chromium.puppeteer.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
    })
    const page = await browser.newPage();
    await page.goto(weburl);
    const screenshotPath = '/tmp/screenshot.png';
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    res.sendFile(screenshotPath);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
