import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { uploadMultipleImages, convertFileToBase64, deleteImages } from "@/utils/cloudinary";
import { CreateProductInput, ProductImageInput, UpdateProductInput } from "./product.types";
import { NotFoundError } from "@/utils/response";
import { generateProductCode } from "@/utils/generateCode";

export type ProductListFilters = {
    category_id?: string
    search?: string
    min_price?: number
    max_price?: number
    sort_by?: "featured" | "price-low" | "price-high" | "name"
    page?: number
    page_size?: number
}

export const productService = {


  async getProducts(options: Prisma.ProductFindManyArgs = {}) {
    const {
      where,
      skip = 0,
      take = 10,
      orderBy,
    } = options

    return prisma.product.findMany({
      where,
      skip,
      take,

      orderBy:
        (orderBy as Prisma.ProductOrderByWithRelationInput) ?? {
          createdAt: "desc",
        },

      include: {
        category: true,
        images: true,
        variants: true
      },
    })
  },
  // async getAllProducts() {
  //   const products = await prisma.product.findMany({
  //     include: {
  //       category: true,
  //       images: true,
  //       variants: true
  //     }
  //   })
  //   return products
  // },

  async getAllProducts(filters: ProductListFilters = {}) {
    const {
      category_id,
      search,
      min_price,
      max_price,
      sort_by = "featured",
      page = 1,
      page_size = 20,
    } = filters

    // 🔍 ກອງດ້ວຍ category / search ກ່ອນ (ເຮັດໄດ້ໃນ Prisma query ໂດຍກົງ)
    const products = await prisma.product.findMany({
      where: {
        ...(category_id && category_id !== "all" && { category_id }),
        ...(search && {
          product_name: {
            contains: search,
            mode: "insensitive",
          },
        }),
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
      orderBy:
        sort_by === "name"
          ? { product_name: "asc" }
          : { createdAt: "desc" },
    })

    // 💰 ຄຳນວນ min_price / max_price / total_stock ຈາກ variants
    // (ລາຄາ ແລະ stock ບໍ່ໄດ້ຢູ່ໃນ Product ໂດຍກົງ, ມັນຢູ່ໃນ ProductVariant)
    let result = products.map((p) => {
      const prices = p.variants.map((v) => v.sale_price)
      const total_stock = p.variants.reduce((sum, v) => sum + v.stock_qty, 0)

      return {
        ...p,
        min_price: prices.length ? Math.min(...prices) : 0,
        max_price: prices.length ? Math.max(...prices) : 0,
        total_stock,
      }
    })

    // 🎯 ກອງດ້ວຍຊ່ວງລາຄາ (ຕ້ອງເຮັດຫຼັງຄຳນວນ min_price ແລ້ວ ເພາະບໍ່ແມ່ນ column ໃນ DB)
    if (min_price !== undefined) {
      result = result.filter((p) => p.min_price >= min_price)
    }
    if (max_price !== undefined) {
      result = result.filter((p) => p.min_price <= max_price)
    }

    // ↕️ sort ຕາມລາຄາ (ສ່ວນ name/featured ຈັດໄປແລ້ວໃນ query ຂັ້ນເທິງ)
    if (sort_by === "price-low") {
      result.sort((a, b) => a.min_price - b.min_price)
    } else if (sort_by === "price-high") {
      result.sort((a, b) => b.min_price - a.min_price)
    }

    // 📄 pagination
    const total = result.length
    const start = (page - 1) * page_size
    const items = result.slice(start, start + page_size)

    return {
      items,
      meta: {
        total,
        page,
        page_size,
        total_pages: Math.ceil(total / page_size),
      },
    }
  },

  /**
   * ໃຊ້ຕັ້ງຄ່າ default ຂອງ price slider ໃນ frontend
   */
  async getPriceRange() {
    const result = await prisma.productVariant.aggregate({
      _min: { sale_price: true },
      _max: { sale_price: true },
    })

    return {
      min: result._min.sale_price ?? 0,
      max: result._max.sale_price ?? 0,
    }
  },

  async getProduct(id: string) {
    const product = await prisma.product.findUnique({
      where: { product_id: id },
      include: {
        images: true,
        category: true,
        variants: true
      },
    })

    return product

  },


  async createProduct(data: CreateProductInput) {
    // 1. Upload images if provided
    let images: ProductImageInput[] = []
    if (data.files?.length) {
      const base64Files = await Promise.all(data.files.map(convertFileToBase64))
      const uploaded = await uploadMultipleImages(base64Files, data.folder ?? "products")
      images = uploaded.map(img => ({
        image_url: img.url,
        public_id: img.publicId,
      }))
    }

    // 2. Auto-generate product code
    const product_code = generateProductCode()

    // 3. Create product with images and variants atomically
    const product = await prisma.product.create({
      data: {
        product_name: data.product_name,
        product_code,
        description: data.description,
        category_id: data.category_id,

        images: {
          createMany: { data: images },
        },

        variants: data.variants?.length
          ? {
            createMany: {
              data: data.variants.map(v => ({
                sku: v.sku,
                color: v.color,
                size: v.size,
                purchase_price: v.purchase_price,
                sale_price: v.sale_price,
                stock_qty: v.stock_qty ?? 0,
              })),
            },
          }
          : undefined,
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    })

    return product
  },

  /* 🔥 UPDATE (replace images) */
  async updateProduct(productId: string, data: UpdateProductInput) {
    // 1. ກວດວ່າສິນຄ້າມີຢູ່
    const existing = await prisma.product.findUnique({
      where: { product_id: productId },
      include: { images: true, variants: true },
    })

    if (!existing) {
      throw new NotFoundError("Product not found")
    }

    // 2. ອັບໂຫຼດຮູບໃໝ່ (ຖ້າມີ)
    let newImages: ProductImageInput[] = []
    if (data.files?.length) {
      const base64Files = await Promise.all(data.files.map(convertFileToBase64))
      const uploaded = await uploadMultipleImages(base64Files, data.folder ?? "products")
      newImages = uploaded.map(img => ({
        image_url: img.url,
        public_id: img.publicId,
      }))
    }

    // 3. ອັບເດດສິນຄ້າ
    const updatedProduct = await prisma.product.update({
      where: { product_id: productId },
      data: {
        product_name: data.product_name,
        description: data.description,
        category_id: data.category_id,

        // ເພີ່ມຮູບໃໝ່ (ບໍ່ລຶບຮູບເກົ່າທີ່ຍັງຢູ່)
        ...(newImages.length > 0 && {
          images: {
            createMany: { data: newImages }
          }
        }),

        // ອັບເດດ variants — ລຶບເກົ່າ ແລ້ວສ້າງໃໝ່
        ...(data.variants && {
          variants: {
            deleteMany: {}, // ລຶບ variants ເກົ່າທັງໝົດ
            createMany: {
              data: data.variants.map(v => ({
                sku: v.sku,
                color: v.color,
                size: v.size,
                purchase_price: v.purchase_price,
                sale_price: v.sale_price,
                stock_qty: v.stock_qty ?? 0,
              }))
            }
          }
        }),
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    })

    return updatedProduct
  },


  /* 🔥 DELETE IMAGE */
  async deleteImage(imageId: string) {
    // console.log("imageId : ", imageId)

    const image = await prisma.productImage.findUnique({
      where: { image_id: imageId }
    });
    if (!image) throw new NotFoundError("Image not found");
    await deleteImages([image.public_id]);
    await prisma.productImage.delete({
      where: { image_id: imageId }
    });

    return true;
  },


  async deleteProduct(productId: string) {

    const product = await prisma.product.findUnique({
      where: { product_id: productId },
      include: { images: true }
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (product.images.length) {
      await deleteImages(product.images.map(i => i.public_id));
    }

    await prisma.product.delete({
      where: { product_id: productId }
    });

    return true;
  }

}