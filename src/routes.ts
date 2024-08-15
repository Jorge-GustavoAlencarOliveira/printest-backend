import { Request, Response, Router, response, text } from 'express';
import { PDFDocument } from 'pdf-lib';
import { pdfmakeGenerate } from './utils/pdfmakegenerate';
import { orderDetails, zipFile } from './teste';

const routes = Router();

routes.post('/print', async (request: Request, response: Response) => {
  if (!request.headers.authorization) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  const token = request.headers.authorization?.split(' ');
  const { order_id, shipping_id } = request.body;

  const pdfBuffer = await zipFile(shipping_id, token[1])

  const order = await orderDetails(order_id, token[1])

  const declarationContent = await pdfmakeGenerate(order);

  const firstPdfDoc = await PDFDocument.load(pdfBuffer);
  const secondPdfDoc = await PDFDocument.load(declarationContent);

  const doc = await PDFDocument.create();

  const [firstPage] = await doc.copyPages(firstPdfDoc, [0]);
  const [secondPage] = await doc.copyPages(secondPdfDoc, [0]);

  doc.addPage(firstPage);
  doc.insertPage(1, secondPage);

  const pdfBytes = await doc.save();
  

  response.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="merged.pdf"',
    'Content-Length': pdfBytes.length,
  });

  response.end(pdfBytes);
});

routes.get('/shipping', async (Request: Request, res: Response) => {
  try {
    const apiResponse = await fetch(
      'https://api.mercadolibre.com/shipment_labels?shipment_ids=43636930013',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer APP_USR-3601117921978914-080907-ecdf48eab73d3f552a147f0634504d51-1913378218`,
        },
      },
    );

    if (!apiResponse.ok) {
      throw new Error(`API response error: ${apiResponse.status}`);
    }

    const zipBuffer = await apiResponse.arrayBuffer();
    
    
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching shipping label' });
  }
});
export { routes };

// const response = await fetch(
//   `https://api.mercadolibre.com/shipments/43636930013`,
//   {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer APP_USR-3601117921978914-080907-ecdf48eab73d3f552a147f0634504d51-1913378218`,
//       'Content-Type': 'application/json',
//       'x-format-new': 'true',
//     },
//   },
// );
// if (!response.ok) {
//   throw new Error(`Erro na requisição: ${response.statusText}`);
// }

// const data = await response.json();

// return Response.json(data);
