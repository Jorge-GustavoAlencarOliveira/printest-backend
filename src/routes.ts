import { Request, Response, Router } from 'express';
import { PDFDocument } from 'pdf-lib';
import { pdfmakeGenerate } from './utils/pdfmakegenerate';
import { orderDetails, zipFile } from './teste';
import { isAuthenticated } from './middlewares/isAuthenticated';
import { ValidatedToken } from './actions/authSession';
const router = Router();

router.get('/', isAuthenticated , async (request: Request, response: Response) => {
  const authorizationHeader = request.headers.authorization;
  const [, token] = authorizationHeader.split(' ');
  const validation = await ValidatedToken(token)
  return response.json(validation)
})

router.post('/print', isAuthenticated, async (request: Request, response: Response) => {
 
  const { order_id, shipping_id, token } = request.body;

  const pdfBuffer = await zipFile(shipping_id, token)

  const order = await orderDetails(order_id, token)

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

// routes.get('/shipping', async (Request: Request, res: Response) => {
//   try {
//     const apiResponse = await fetch(
//       'https://api.mercadolibre.com/shipment_labels?shipment_ids=43636930013',
//       {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer APP_USR-3601117921978914-080907-ecdf48eab73d3f552a147f0634504d51-1913378218`,
//         },
//       },
//     );

//     if (!apiResponse.ok) {
//       throw new Error(`API response error: ${apiResponse.status}`);
//     }

//     const zipBuffer = await apiResponse.arrayBuffer();
    
    
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Error fetching shipping label' });
//   }
// });
export { router };


