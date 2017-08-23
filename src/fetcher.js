const async = require('async')
const request = require('request')
const { parseCSRFToken, parseProductInfo, parseLocations } = require('./parser')

function fetch(skuList, callback) {

	const result = []

	async.eachSeries(Object.keys(skuList), (sku, next) => {

		const skuRequest = {
			sku,
			quantity: skuList[sku],
			product: null,
			locations: null,
		}

		request({
			method: 'GET',
			url: `https://leroymerlin.ru/catalogue/search/?q=${sku}`,
		}, (error, response, body) => {

			if (error) {

				console.error(error)
				return next(error)

			}

			if (response.statusCode !== 200) {

	 			console.error('Bad response', response.statusCode)
				return next(error)

			}

			const cookie = response.headers['set-cookie'].join('; ')
			const csrfToken = parseCSRFToken(body)
			const product = parseProductInfo(body)

			if (csrfToken === null) {

				console.error('CSRF token not found')
				return next(error)

			}

			if (product === null) {

				console.error('Product info not found')
				return next(error)

			}
			
			request({
				method: 'POST',
				url: `https://leroymerlin.ru/bitrix/php_interface/ajax/nalInStock.php`,
				headers: {
				    'X-Requested-With': 'XMLHttpRequest',
				    'Cookie': cookie,
				},
				form: {
					art: sku,
					csrf_token: csrfToken,
				},
			}, (error, response, body) => {

				if (error) {

					console.error(error)
					return next(error)

				}

				if (response.statusCode !== 200) {

					console.error(response.statusCode)
					return next(error)

				}

				const locationsInfo = parseLocations(body)

				if (locationsInfo === null) {

					console.error('Locations info not found')
					return next(error)

				}

				skuRequest.locations = locationsInfo
				skuRequest.product = product
				result.push(skuRequest)

				next()

			})

		})

	}, (error) => {

		if( error ) {
			
			return callback(error)

		}

		return callback(null, result)
	
	})

}

module.exports = {
	fetch,
}