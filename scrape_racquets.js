const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeRacquets() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    const brands = {
        'babolat': 'https://www.tennis-warehouse.com/catpage-BABOLATRACQUETS.html',
        'head': 'https://www.tennis-warehouse.com/catpage-HEADRACQUETS.html', 
        'wilson': 'https://www.tennis-warehouse.com/catpage-WILSONRACQUETS.html',
        'yonex': 'https://www.tennis-warehouse.com/catpage-YONEXRACQUETS.html',
        'technifibre': 'https://www.tennis-warehouse.com/catpage-TECHIFIBRERACQUETS.html'
    };
    
    const allRacquets = {};
    
    for (const [brand, url] of Object.entries(brands)) {
        console.log(`Scraping ${brand} racquets...`);
        
        try {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            
            // Wait for products to load
            await page.waitForSelector('.product', { timeout: 10000 });
            
            const racquets = await page.evaluate(() => {
                const products = document.querySelectorAll('.product');
                const results = [];
                
                products.forEach(product => {
                    const nameElement = product.querySelector('.product-name a, .product-title a, h3 a, .name a');
                    const specElement = product.querySelector('.specs, .product-specs, .specifications');
                    
                    if (nameElement) {
                        let name = nameElement.textContent.trim();
                        let specs = '';
                        
                        if (specElement) {
                            specs = specElement.textContent.trim();
                        }
                        
                        // Extract weight and head size if available
                        let weight = '';
                        let headSize = '';
                        
                        const weightMatch = specs.match(/(\\d+)g|Weight:\\s*(\\d+)/i);
                        if (weightMatch) {
                            weight = weightMatch[1] || weightMatch[2];
                        }
                        
                        const headMatch = specs.match(/(\\d+)\\s*sq\\s*in|Head\\s*Size:\\s*(\\d+)/i);
                        if (headMatch) {
                            headSize = headMatch[1] || headMatch[2];
                        }
                        
                        // Clean up name
                        name = name.replace(/\\s*\\([^)]*\\)\\s*$/, '').trim();
                        
                        results.push({
                            name: name,
                            weight: weight,
                            headSize: headSize,
                            specs: specs
                        });
                    }
                });
                
                return results;
            });
            
            allRacquets[brand] = racquets;
            console.log(`Found ${racquets.length} ${brand} racquets`);
            
        } catch (error) {
            console.error(`Error scraping ${brand}:`, error.message);
            allRacquets[brand] = [];
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    await browser.close();
    
    // Save to file
    fs.writeFileSync('/home/user/webapp/racquets_data.json', JSON.stringify(allRacquets, null, 2));
    
    console.log('Scraping completed. Data saved to racquets_data.json');
    return allRacquets;
}

// Run the scraper
scrapeRacquets().catch(console.error);