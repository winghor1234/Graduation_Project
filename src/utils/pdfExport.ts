// import PDFDocument from "pdfkit"

// export const generatePdf =
//     async (
//         title: string,
//         data: any[]
//     ) => {

//         return new Promise<Buffer>(
//             (resolve, reject) => {

//                 const doc =
//                     new PDFDocument()

//                 const buffers: Buffer[] = []

//                 doc.on(
//                     "data",
//                     buffers.push.bind(buffers)
//                 )

//                 doc.on("end", () => {

//                     resolve(
//                         Buffer.concat(buffers)
//                     )
//                 })

//                 doc.on("error", reject)

//                 // title
//                 doc.fontSize(20)
//                     .text(title, {
//                         align: "center"
//                     })

//                 doc.moveDown()

//                 // data
//                 data.forEach((item) => {

//                     doc.fontSize(12)
//                         .text(
//                             JSON.stringify(
//                                 item,
//                                 null,
//                                 2
//                             )
//                         )

//                     doc.moveDown()
//                 })

//                 doc.end()
//             }
//         )
//     }