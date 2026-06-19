import { NextRequest } from "next/server"
import { productService } from "./product.service"
import { successResponse } from "@/utils/response"
import { getPaginationMeta, getPaginationParams } from "@/utils/pagination"
import { getSearchParam } from "@/utils/search"
import { getSortingParams } from "@/utils/sorting"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { formDataParser } from "@/utils/cloudinary"
import { CreateProductInput } from "./product.types"
import { handleError } from "@/utils/handleError"

export const productController = {
    async getProducts(req: NextRequest) {
        try {
            const { page, limit, skip } = getPaginationParams(req)
            const search = getSearchParam(req)
            const orderBy = getSortingParams(req)
            const where: Prisma.ProductWhereInput = search
                ? {
                    OR: [
                        {
                            product_name: {
                                contains: search,
                                mode: "insensitive"
                            }
                        },
                        {
                            product_code: {
                                contains: search,
                                mode: "insensitive"
                            }
                        },
                        {
                            category: {
                                category_name: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            }
                        }
                    ]
                } : {}
            const [products, total] = await Promise.all([
                productService.getProducts({
                    where,
                    skip,
                    take: limit,
                    orderBy
                }),
                prisma.product.count({ where })
            ])
            const meta = getPaginationMeta(total, page, limit)
            return successResponse({ data: products, meta }, "Get products successfully", 200)

        } catch (error) {
            return handleError(error)
        }

    },
    async getAllProducts(req: NextRequest) {
        try {
            const products = await productService.getAllProducts()
            return successResponse(products, "Get all products successfully", 200)
        } catch (error) {
            return handleError(error)
        }
    },

    async getProduct(req: NextRequest, id: string) {
        // console.log("id from frontend : ",id)
        try {
            const product = await productService.getProduct(id)
            return successResponse(product, "Get product successfully", 200)
        } catch (error) {
           return handleError(error)

        }
    },

    // async createProduct(req: NextRequest) {
    //     try {
    //         const fd = await req.formData()
    //         const body = {
    //             product_name: fd.get("product_name") as string,
    //             purchase_price: Number(fd.get("purchase_price")),
    //             sale_price: Number(fd.get("sale_price")),
    //             description: fd.get("description") as string,
    //             stock_qty: Number(fd.get("stock_qty")),
    //             category_id: fd.get("category_id") as string,
    //             files: fd.getAll("images") as File[],
    //         }
    //         console.log(body)
    //         const product = await productService.createProduct(body)
    //         return successResponse(product, "Product created successfully", 201)
    //     } catch (error) {
    //         console.log(error)

    //         if (
    //             error instanceof BadRequestError ||
    //             error instanceof NotFoundError ||
    //             error instanceof ForbiddenError ||
    //             error instanceof UnauthorizedError
    //         ) {
    //             return errorResponse(error.message, error.statusCode)
    //         }

    //         return errorResponse("Internal Server Error", 500)
    //     }
    // },

    async createProduct(req: NextRequest) {
        try {
            const fd = await req.formData()

            // variants come as a JSON string from the client
            const variantsRaw = fd.get("variants") as string | null
            const variants = variantsRaw ? JSON.parse(variantsRaw) : []

            const body: CreateProductInput = {
                product_name: fd.get("product_name") as string,
                description: fd.get("description") as string,
                category_id: fd.get("category_id") as string,
                folder: (fd.get("folder") as string) ?? "products",
                files: fd.getAll("images") as File[],
                variants,
            }

            const product = await productService.createProduct(body)
            return successResponse(product, "Product created successfully", 201)

        } catch (error) {
            return handleError(error)
        }
    },

    async updateProduct(req: NextRequest, id: string) {
        try {
            const formData = await req.formData()

            const variantsRaw = formData.get("variants") as string | null
            const variants = variantsRaw ? JSON.parse(variantsRaw) : undefined

            const product = await productService.updateProduct(id, {
                product_name: formDataParser.string(formData, "product_name"),
                description: formDataParser.string(formData, "description"),
                category_id: formDataParser.string(formData, "category_id"),
                files: formData.getAll("images") as File[],
                variants,
            })

            return successResponse(product, "Product updated successfully", 200)
        } catch (error) {
            return handleError(error)
        }
    },
    async deleteImage(req: NextRequest, id: string) {
        try {
            // console.log("id : ", id)
            const image = await productService.deleteImage(id);
            return successResponse(image, "Image deleted successfully", 200);
        } catch (error) {
            return handleError(error)
        }
    },

    async deleteProduct(req: NextRequest, id: string) {
        try {
            const product = await productService.deleteProduct(id)
            return successResponse(product, "Product deleted successfully", 200)
        } catch (error) {
            return handleError(error)
        }
    }


}