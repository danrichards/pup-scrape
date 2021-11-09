const fs = require('fs');
const puppeteer = require('puppeteer');
const sharp = require('sharp');
const md5 = require('md5');
const yargs = require('yargs');

// Fetch a URL, screenshot, and compare a cropped fragment with another URL as a truth test.
// Usage: node index.js same_url_png_box 
// Example: node index.js same_url_png_box --
const argv = yargs
    .command('same-url-png', 'Is the viewbox the same?', {
        url: {
            description: 'The URL to fetch and screenshot.',
            alias: 'u',
            type: 'string',
        },
        // Provide a passing truth test (a URL) and make our MD5 to compare.
        truth: {
        		description: 'The URL we will use for the truth test.',
        		alias: 't',
        		type: 'string'
        },
        // If we already have an MD5 of a passing URL image cropping, save a request.
        md5: {
        		description: 'Skip the truth test because we already know the MD5.',
        		alias: 'm',
        		type: 'string'
        }
    })
    .option('left', {
        alias: 'x',
        description: 'Provide the X (left-most coordinate)',
        type: 'integer',
        default: 440
    })
    .option('top', {
        alias: 'y',
        description: 'Provide the Y (top-most coordinate)',
        type: 'integer',
        default: 494
    })
    .option('width', {
        alias: 'w',
        description: 'Provide the width',
        type: 'integer',
        default: 106
    })
    .option('height', {
        alias: 'h',
        description: 'Provide the height',
        type: 'integer',
        default: 19
    })
    .help()
    // Yep the shortcode is `e` the letter E
    .alias('help', 'e')
    .argv;

let {u, x, y, w, h} = argv;

if (argv.u === undefined) {
	console.error('Please provide a URL');
	return;
}

if ((argv.m || argv.t) === undefined) {
	console.error('Please provide a truth (either MD5 -m or truthy tracking -t URL)');
	return;
}

let truth = {x, y, w, h, url: argv.t};
let check = {x, y, w, h, url: u};

md5Image(check).then(md5Check => {
	if (argv.m === undefined) {
		md5Image(truth).then(md5Truth => {
			console.log(md5Check === md5Truth ? 'Delivered' : 'Nope');
		})
	} else {
			console.log(md5Check === argv.m ? 'Delivered' : 'Nope');
	}
});

async function md5Image(obj = {}) {
	const browser = await puppeteer.launch({
		  // Things DO NOT WORK in headless
	    headless: false,
	    // Typically 4s is good enough
	    timeout: 100000
	});

	const page = await browser.newPage();

	await page.goto(obj.url || obj.u);
	await page.waitForNetworkIdle({timeout: 10000});
	await page.screenshot({ path: 'usps.png', fullPage: true });

	// Crop the image
	let uspsImage = 'usps.png';
	let croppedImage = 'croppedUsps.png';
	let md5Image = null;
	const cropped = await sharp(uspsImage)
		.extract({ width: obj.w, height: obj.h, left: obj.x, top: obj.y })
		.toFile(croppedImage)

	browser.close();

	// md5 the file
	return md5(fs.readFileSync(croppedImage));
}
