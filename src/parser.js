const zipObject = require('lodash/zipObject')

function parseCSRFToken(text) {

    const csrfPattern = /\{ csrf_token: "([0-9a-f]{32})" \}/
    const csrfTokenMatch = csrfPattern.exec(text)

    if (csrfTokenMatch === null) {

        return null

    }

    return csrfTokenMatch[1]
}

function parseProductInfo(text) {

    const urlPattern = /<meta property="og:url" content="(.*)">/
    const urlMatch = urlPattern.exec(text)

    const productNamePattern = /<h1 class="product__hl">([^<]+)<\/h1>/
    const productNameMatch = productNamePattern.exec(text)

    const productPricePattern = /<input type="hidden" data-name="UF_PRICE" value="(\d+)\.00"\/>/
    const productPriceMatch = productPricePattern.exec(text)

    const productImagePattern = /data-large="(.*)"/
    const productImageMatch = productImagePattern.exec(text)

    if (urlMatch === null || productNameMatch === null || productImageMatch === null || productPriceMatch === null) {

        return null

    }

    return {
        url: urlMatch[1],
        name: productNameMatch[1],
        price: parseInt(productPriceMatch[1], 10),
        image: productImageMatch[1],
    }

}

function mathcAll(text, pattern) {

    const result = []

    while (true) {

        const match = pattern.exec(text)

        if (match !== null) {

            result.push(match[1])
            continue
        
        }

        break

    }

    return result

}

function parseLocations(text) {

    const shopNamePattern = /<b class='fs001'>([^<]+)<\/b>/g
    const names = mathcAll(text, shopNamePattern).map(name => name.replace('Леруа Мерлен ', ''))
    
    const inStockPattern = /<span class='fs002'>Примерный запас товара: (\d+)/g
    const inStocks = mathcAll(text, inStockPattern).map(inStock =>  parseInt(inStock, 10))

    return zipObject(names, inStocks)

}

module.exports = {
    parseCSRFToken,
    parseProductInfo,
    parseLocations,
}
