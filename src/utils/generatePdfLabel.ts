import { PDFDocument } from 'pdf-lib';
import { orderDetails, zipFile } from '../teste';
import { pdfmakeGenerate } from './pdfmakegenerate';

export type SelectedOrdersProps = {
  order_id: number;
  shipping_id: number;
};

export async function generatePdfLabel({ selectedOrders, token }) {
  
  const doc = await PDFDocument.create();

  for (const { shipping_id, order_id } of selectedOrders) {
    // Gera o PDF para cada label
    const pdfBuffer = await zipFile(shipping_id, token);
    const order = await orderDetails(order_id, token);
    const declarationContent = await pdfmakeGenerate(order);

    if (pdfBuffer instanceof Error) return pdfBuffer.message;

    // Carrega os PDFs gerados
    const labelPdfDoc = await PDFDocument.load(pdfBuffer);
    const declarationPdfDoc = await PDFDocument.load(declarationContent);

    // Copia as páginas dos PDFs para o documento principal
    const firstPages = await doc.copyPages(
      labelPdfDoc,
      labelPdfDoc.getPageIndices(),
    );
    firstPages.forEach((page) => doc.addPage(page));

    const secondPages = await doc.copyPages(
      declarationPdfDoc,
      declarationPdfDoc.getPageIndices(),
    );
    secondPages.forEach((page) => doc.addPage(page));
  }

  // Salva o documento PDF final
  const pdfBytes = await doc.save();

  return pdfBytes;
}
