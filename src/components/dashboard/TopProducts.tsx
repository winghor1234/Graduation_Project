
// const products = [
//     { name: "Running Shoes Pro", price: "$120", sold: 980 },
//     { name: "Training Shorts", price: "$45", sold: 845 },
//     { name: "Hoodie Sport", price: "$80", sold: 620 },
// ]
type topProduct = {
    productName: string
    product_code: string
    price: number
    sold: number

}

type Props = {
    products: topProduct[]
}
export function TopProducts({products }: Props ) {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
            <h3 className="font-semibold text-gray-800 mb-4">
                Top Products
            </h3>

            <div className="space-y-4">
                {products.map((p, i) => (
                    <div
                        key={i}
                        className=" flex justify-between items-center"
                    >
                        <div>
                            <p className="font-medium text-gray-700">
                                {p.productName}
                            </p>
                            <p className="text-sm text-gray-400">
                                {p.sold} sold
                            </p>
                        </div>

                        <span className="font-semibold text-green-600">
                            {p.price}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}