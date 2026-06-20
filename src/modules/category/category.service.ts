import { prisma } from "@/lib/prisma"
import { BadRequestError, NotFoundError } from "@/utils/response";
import { Prisma } from "@prisma/client"
type GetCategoriesOptions = Prisma.CategoryFindManyArgs

export const categoryService = {





  async getCategories(options: GetCategoriesOptions = {}) {
    const {
      where,
      skip = 0,
      take = 10,
      orderBy,
    } = options

    return prisma.category.findMany({
      where,
      skip,
      take,
      orderBy:
        (orderBy as Prisma.CategoryOrderByWithRelationInput) ?? {
          createdAt: "desc",
        },
    })
  },

  // getAllCategories() {

  //   return prisma.category.findMany({
  //     include: {
  //       products: true
  //     }
  //   })
  // },

  getAllCategories() {
    // ❗ ປ່ຽນ products: true → _count
    // ກ່ອນນີ້ດຶງ Product object ທັງໝົດຂອງທຸກ category ມານຳ (ໜັກ, ບໍ່ຈຳເປັນ
    // ສຳລັບແຕ່ Sidebar filter — ຕ້ອງການແຕ່ຈຳນວນສິນຄ້າແຕ່ລະໝວດ)
    return prisma.category.findMany({
        include: {
            _count: {
                select: { products: true },
            },
        },
        orderBy: { category_name: "asc" },
    })
},
  async getCategory(id: string) {
    const category = await prisma.category.findUnique({
      where: { category_id: id }
    })
    return category
  },

  async createCategory(data: Prisma.CategoryCreateInput) {
    const category = await prisma.category.create({
      data
    });
    if (!category) {
      throw new BadRequestError("Category not created");
    }
    return category;


  },

  async updateCategory(id: string, data: Prisma.CategoryUpdateInput) {

    const category = await prisma.category.update({
      where: { category_id: id },
      data
    });
    if (!category) {
      throw new BadRequestError("Category not updated");
    }
    return category;



  },

  async deleteCategory(id: string) {

    const category = await prisma.category.findUnique({
      where: { category_id: id },
      include: {
        products: true
      }
    })

    if (!category) {
      throw new NotFoundError("Category not found")
    }

    // ❌ ห้ามลบถ้ายังมีสินค้า
    if (category.products.length > 0) {
      throw new BadRequestError("Cannot delete category with products")
    }

    return prisma.category.delete({
      where: { category_id: id }
    })
  }

}