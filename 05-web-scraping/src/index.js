import jsdom from "jsdom";
import fetch from "isomorphic-fetch"
import puppeteer from "puppeteer"

/////////////////////////////////////////////////////////////////////Partie 1 - Screenshot Wikipedia
(async () => {
    const browser = await puppeteer.launch({
        defaultViewport: { width: 1920, height: 1700 }
    });
    const page = await browser.newPage();
    await page.goto('https://fr.wikipedia.org/wiki/Canton_(Suisse)#Données_cantonales');
    await page.screenshot({ path: './Cantons.png' });
    await browser.close();
})();


/////////////////////////////////////////////////////////////////Partie 2 - Webscraper Wikipedia
(async () => {
    const url = 'https://fr.wikipedia.org/wiki/Canton_(Suisse)';
    const browser = await puppeteer.launch();

    try {
        const page = await browser.newPage();
        await page.goto(url);

        const rawData = await page.$$eval('table tr', rows => {
            return Array.from(rows, row => {
                const columns = row.querySelectorAll('td');
                return Array.from(columns, column => column.innerText);
            });
        });

        // Prepare array with values
        let result = [];
        for (let i = 2; i < 28; i++) {
            result.push([rawData[i][0], rawData[i][3]]);
        }

        // Formating array
        for (let i = 0; i < 26; i++) {

            // Keep only name of Canton
            let string = result[i][0];
            if (string.includes('\n')) {
                result[i][0] = string.slice(0, string.indexOf('\n'));
            }

            // Remove spaces in number and convert to Integer
            result[i][1] = result[i][1].replaceAll(/\s/g, '');
            result[i][1] = parseInt(result[i][1])
        }

        console.table(result);

    } catch (error) {
        console.log('error', error);
    }
})();


////////////////////////////////////////////////////Partie 3 - Webscraper e-commerce
(async () => {
    const url = 'https://www.webscraper.io/test-sites/e-commerce/allinone/computers/laptops';
    const browser = await puppeteer.launch();

    try {
        const page = await browser.newPage();
        await page.goto(url);

        let productList = [];

        let div = await page.$$('div.thumbnail')

        for (let el of div) {
            let product = await el.$eval('.title', el => el.textContent);
            let price = await el.$eval('.price', el => el.textContent);
            let stars = await el.$eval('.ratings :nth-child(2)', el => el.getAttribute('data-rating'));
            stars = parseInt(stars);

            let productComplete = {
                produit: product,
                prix: price,
                etoiles: stars
            }

            productList.push(productComplete);
        }

        console.table(productList);

    } catch (error) {
        console.log('error', error);
    }
})();