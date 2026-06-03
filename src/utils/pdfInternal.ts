import jsPDF from "jspdf";
export const getPageCount = (doc: jsPDF) => {
    const internal = doc.internal as unknown as {  getNumberOfPages: () => number; };
    return internal.getNumberOfPages();
};