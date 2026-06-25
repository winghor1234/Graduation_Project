import { Delivery } from "../delivery/delivery.type"

export  type Province = {
    province_id: string
    province_name: string
    districts: District[]
    addressBranches: AddressBranch[]
}

export type District = {
    district_id: string
    district_name: string
    branches: Branch[]
    province: Province

}

export type Branch = {
    branch_id: string
    branch_name: string
    district_id: string
    district: District
    addressBranches: AddressBranch[]
    
}


export type AddressBranch = {
    address_id: string
    province_id: string
    district_id: string
    branch_id: string
    deliveries: Delivery[]
}


export type CreateProvinceInput = {
    province_name: string
}
export type updateProvinceInput = Partial<CreateProvinceInput>

export type CreateDistrictInput = {
    province_id: string
    district_name: string
}
export type updateDistrictInput = Partial<CreateDistrictInput>

export type CreateBranchInput = {
    district_id: string
    branch_name: string
}
export type updateBranchInput = Partial<CreateBranchInput>

export type CreateAddressBranchInput = {
    province_id: string
    district_id: string
    branch_id: string
}
export type updateAddressBranchInput = Partial<CreateAddressBranchInput>