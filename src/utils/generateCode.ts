 const generateRandomString = (length = 5) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return result
}

 const getTodayDate = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}${month}${day}`
}



export const generateProductCode = () => {
  return `PRD-${getTodayDate()}-${generateRandomString(5)}`
}


export const generateOrderCode = () => {
  return `ORD-${getTodayDate()}-${generateRandomString(5)}`
}


export const generatePurchaseCode = () => {
  return `PUR-${getTodayDate()}-${generateRandomString(5)}`
}

export const generateImportCode = () => {
  return `IMP-${getTodayDate()}-${generateRandomString(5)}`
}


export const generateRefundCode = () => {
  return `REF-${getTodayDate()}-${generateRandomString(5)}`
}

export const generateTrackingCode = () => {
  return `TRK-${getTodayDate()}-${generateRandomString(5)}`
}

export const generatePaymentCode = () => {
  return `PAY-${getTodayDate()}-${generateRandomString(5)}`
}


export const generateInvoiceCode = () => {
  return `INV-${getTodayDate()}-${generateRandomString(5)}`
}