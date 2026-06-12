import { z } from "zod"

/* ----------------------------- Start Product Schema ----------------------------- */
export const productSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  purchase_price: z.number().min(1, "Purchase price is required"),
  sale_price: z.number().min(1, "Sale price is required"),
  stock_qty: z.number().min(1, "Stock quantity is required"),
  category_id: z.string().min(1, "Category is required"),
  description: z.string().optional()
})
// export const productSchema = z.object({
//   product_name: z.string().min(1, "Required"),
//   purchase_price: z.coerce.number().min(0),
//   sale_price: z.coerce.number().min(0),
//   stock_qty: z.coerce.number().min(0),
//   category_id: z.string().min(1, "Required"),
//   description: z.string().optional()
// });
export type ProductFormValues = z.infer<typeof productSchema>
/* ----------------------------- Start Product Schema ----------------------------- */


// Category Schema
export const categoryCreateSchema = z.object({
  category_name: z.string().min(1, "Category name is required"),
  description: z.string().optional()
})
export type CategoryCreateFormInput = z.infer<typeof categoryCreateSchema>
export type CategoryUpdateFormInput = z.infer<typeof categoryUpdateSchema>
export const categoryUpdateSchema = categoryCreateSchema.partial()









// Customer Schema
export const customerAddSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  phone: z.string().min(5, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  email: z.string().email(),
  address: z.string().optional(),
  gender: z.string().optional(),
  isActive: z.boolean().optional()
})
export type CustomerAddFormValues = z.infer<typeof customerAddSchema>

export const customerEditSchema = z.object({
  customer_name: z.string().min(1).optional(),
  phone: z.string().min(5).optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  gender: z.string().optional(),
  isActive: z.boolean().optional(),
})
export type customerEditFormValues = z.infer<typeof customerEditSchema>



// Supplier Schema
export const supplierSchema = z.object({
  supplier_name: z.string().min(1),
  phone: z.string(),
  address: z.string().optional()
})
export type SupplierInput = z.infer<typeof supplierSchema>
export const supplierUpdateSchema = supplierSchema.partial()
export type SupplierUpdateInput = z.infer<typeof supplierUpdateSchema>



// Purchase Schema
export const purchaseDetailSchema = z.object({
  product_id: z.string(),
  quantity: z.number().min(1, "Quantity is required"),
  price: z.number().min(1, "Price is required")
})
export const purchaseSchema = z.object({
  supplier_id: z.string(),
  purchase_details: z.array(purchaseDetailSchema)
})
export type PurchaseFormValues = z.infer<typeof purchaseSchema>




// Import Schema
export const importDetailSchema = z.object({
  product_id: z.string(),
  product_name: z.string().optional(),
  quantity: z.number(),
  cost_price: z.number(),

})
export const importSchema = z.object({
  purchase_id: z.string(),
  employee_id: z.string().optional(),
  import_date: z.date().optional(),
  import_details: z.array(importDetailSchema)
})
export type ImportFormValue = z.infer<typeof importSchema>



// Order Schema
export const orderItemSchema = z.object({
  product_id: z.number(),
  quantity: z.number().min(1),
  price: z.number()
})
export const orderSchema = z.object({
  customer_id: z.number(),
  status: z.string().optional(),
  items: z.array(orderItemSchema)
})
export type OrderInput = z.infer<typeof orderSchema>




// Sale Schema
export const saleItemSchema = z.object({
  product_id: z.number(),
  quantity: z.number().min(1),
  price: z.number()
})
export const saleSchema = z.object({
  employee_id: z.number(),
  customer_id: z.number().optional(),
  items: z.array(saleItemSchema)
})
export type SaleInput = z.infer<typeof saleSchema>


// auth customer login schema
export const customerLoginAuthSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string(),
  password: z.string(),
  point: z.number().optional()

})
export type CustomerLoginInput = z.infer<typeof customerLoginAuthSchema>

// auth customer register schema
export const customerCreateSchema = z.object({
  customer_name: z.string(),
  phone: z.string(),
  password: z.string(),
  email: z.string().email(),
  gender: z.string().optional(),
  address: z.string().optional(),
})
export type CustomerCreateFormValues = z.infer<typeof customerCreateSchema>

export const customerUpdateSchema = z.object({
  customer_name: z.string(),
  phone: z.string(),
  email: z.string(),
  gender: z.string().optional(),
  address: z.string().optional(),
})
export type CustomerUpdateFormValues = z.infer<typeof customerUpdateSchema>


// auth admin login schema
export const adminAuthSchema = z.object({
  username: z.string(), password: z.string()
})
export type AdminAuthInput = z.infer<typeof adminAuthSchema>


// Location Schema
export const locationSchema = z.object({
  province_id: z.string(),
  district_id: z.string(),
  branch_id: z.string(),
})
export type LocationInput = z.infer<typeof locationSchema>


//  Province Schema
export const provinceSchema = z.object({
  province_name: z.string(),
})
export type ProvinceFormValues = z.infer<typeof provinceSchema>


// District Schema
export const districtSchema = z.object({
  province_id: z.string(),
  district_name: z.string(),
})
export type DistrictFormValues = z.infer<typeof districtSchema>


// Branch Schema
export const branchSchema = z.object({
  district_id: z.string(),
  branch_name: z.string(),
})
export type BranchFormValues = z.infer<typeof branchSchema>