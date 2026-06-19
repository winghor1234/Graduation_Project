

// export type CreateProductInput = {
//   product_name: string;
//   product_code?: string;
//   purchase_price?: number;
//   sale_price: number;
//   stock_qty: number;
//   category_id: string;
//   description?: string;
//   files?: File[];
//   folder?: string;
// };

// export type UpdateProductInput = Partial<CreateProductInput>;


// export type ProductImageInput = {
//   image_url: string;
//   public_id: string;
// };


export type ProductImage = {
  image_id: string
  image_url: string
  public_id: string
}

export type Product = {
  product_id: string
  product_code: string
  product_name: string
  purchase_price: number
  sale_price: number
  stock_qty: number
  description?: string
  images: ProductImage[]
}
// export type CartItemType = Product & {
//     quantity: number
// }


export type CartItemType = {
    // Product info
    product_id:   string
    product_name: string
    product_code: string
    image_url?:   string

    // Variant info ✅
    variant_id:     string
    color:          string
    size:           string
    sale_price:     number
    purchase_price: number
    stock_qty:      number

    // Cart
    quantity: number
}