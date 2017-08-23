function compactSkuList(skuList) {

	return skuList.reduce(
		(accum, [ sku, quantity ]) => {

			accum[sku] = accum[sku] || 0
			accum[sku] += quantity

			return accum

		},
		Object.create(null)
	 )

}


module.exports = {
	compactSkuList,
}
