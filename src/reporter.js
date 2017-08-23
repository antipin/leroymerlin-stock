const dedent = require('dedent')
const zipWith = require('lodash/zipWith')

function render(products) {

	const dataRows = convertDataToRows(products)
	const tableHTML = renderTable(dataRows)

	return renderPage(tableHTML)

}

function renderPage(content) {

	return dedent`
		<!doctype html>
		<html lang="en">
		<head>
		    <meta charset="utf-8">
		    <meta name="viewport" content="width=device-width, initial-scale=1.0">
		    <title>Продукты</title>
		    <link rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css" integrity="sha384-nn4HPE8lTHyVtfCBi5yW9d20FjT8BJwUXyWZT9InLYax14RDjBj46LmSztkmNP9w" crossorigin="anonymous">
		</head>
		<body>
			${content}
		</body>
		</html>`

}

function renderTable(dataRows) {

	const [ header, ...body ] = dataRows

	const theadHtml = header.map(cell => `<th>${cell}</th>`).join('\n')
	const tbobyHtml = body.map(row => 
		dedent`<tr>${
			row.map(cell => `<td>${cell}</td>`).join('\n')
		}</tr>`
	).join('\n')

	return dedent`
		<table class="pure-table pure-table-bordered">
			<thead>
				${theadHtml}
			</thead>
			<tbody>
				${tbobyHtml}
			</tbody>
		</table>
	`

}

function convertDataToRows(products) {

	const locations = collectAllLocations(products)
	const locationColumns = Object.keys(locations)
	const tableHeader = [ 'Артикул', 'Изображение', 'Название', 'Необходимое кол-во', 'Цена', ...locationColumns ]
	const tableBody = []

	for (let productRequest of products) {

		const { sku, quantity, product, locations } = productRequest		
		const tableRow = [
			sku,
			`<img src="${product.image}" height="50" width="50" />`,
			`<a href="${product.url}">${product.name}</a>`,
			quantity,
			`${product.price}&nbsp;руб.`,
		]

		for (const locationColumn of locationColumns) {

			if (productRequest.locations[locationColumn] !== undefined) {

				tableRow.push(productRequest.locations[locationColumn])

			} else {

				tableRow.push('–')

			}

		}

		tableBody.push(tableRow)

	}

	return [ tableHeader, ...tableBody ]

}

function collectAllLocations(products) {

	const result = {}

	for (const product of products) {

		for (const locationName of Object.keys(product.locations)) {

			result[locationName] = locationName

		}

	}

	return result

}

module.exports = {
	render
}
