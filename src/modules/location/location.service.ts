import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { CreateBranchInput, CreateDistrictInput, CreateProvinceInput } from "./location.type"
export const locationService = {

  async getProvinces(options?: Prisma.ProvinceFindManyArgs) {
    const provinces = await prisma.province.findMany({
      ...options,
      include: {
        districts: {
          include: {
            branches: true
          }
        },
        addressBranches: true
      }
    })
    return provinces
  },

  async getAllProvinces() {
    return prisma.province.findMany({
      include: {
        districts: {
          include: {
            branches: true
          }
        },
        addressBranches: true
      }
    })
  },


  async getDistricts(options?: Prisma.DistrictFindManyArgs) {
    const districts = await prisma.district.findMany({
      ...options,
      include: {
        province: true,
        branches: true,
        addressBranches: true
      }
    })
    return districts
  },



  async getBranches(options?: Prisma.BranchFindManyArgs) {
    const branches = await prisma.branch.findMany({
      ...options,
      include: {
        district: true,
        addressBranches: true
      }
    })
    return branches
  },


  // GET DISTRICT BY PROVINCE
  // async getDistrictByProvince(province_id: string) {
  //   return prisma.district.findUnique({
  //     where: {  },
  //     // include: { province: true }
  //   })
  // },

  // // GET BRANCH BY DISTRICT
  // async getBranchByDistrict(district_id: string) {
  //   return prisma.branch.findUnique({
  //     where: { district_id },
  //     include: { district: true }
  //   })
  // },

  // GET PROVINCE
  async getProvince(id: string) {
    return prisma.province.findUnique({
      where: { province_id: id }
    })
  },

  // GET DISTRICT
  async getDistrict(id: string) {
    return prisma.district.findUnique({
      where: { district_id: id },
      include: { province: true }
    })
  },

  // GET BRANCH
  async getBranch(id: string) {
    return prisma.branch.findUnique({
      where: { branch_id: id },
      include: { district: true }
    })
  },




  async createProvince(data: CreateProvinceInput) {
    return prisma.province.create({ data })
  },

  async createDistrict(data: CreateDistrictInput) {
    return prisma.district.create({ data })
  },

  async createBranch(data: CreateBranchInput) {
    return prisma.branch.create({ data })
  },




  async deleteProvince(id: string) {
    return prisma.province.delete({ where: { province_id: id } })
  },

  async deleteDistrict(id: string) {
    return prisma.district.delete({ where: { district_id: id } })
  },

  async deleteBranch(id: string) {
    return prisma.branch.delete({ where: { branch_id: id } })
  },




  async updateProvince(id: string, data: CreateProvinceInput) {
    return prisma.province.update({ where: { province_id: id }, data })
  },

  async updateDistrict(id: string, data: CreateDistrictInput) {
    return prisma.district.update({ where: { district_id: id }, data })
  },

  async updateBranch(id: string, data: CreateBranchInput) {
    return prisma.branch.update({ where: { branch_id: id }, data })
  },



}