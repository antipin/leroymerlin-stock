#!/usr/bin/env node

const { fetch } = require('./fetcher')
const { render } = require('./reporter')
const { compactSkuList } = require('./utils')
const data = require('../sku-list.js')
const skuList = compactSkuList(data)

fetch(skuList, (error, result) => {

    if( error ) {
        
        console.error(error)

    }

    console.log(render(result))

})
