import { Request, Response, Router } from 'express';
import { PDFDocument } from 'pdf-lib';
import { pdfmakeGenerate } from './utils/pdfmakegenerate';
import { orderDetails, printZipFile, zipFile } from './teste';
import { isAuthenticated } from './middlewares/isAuthenticated';
import { ValidatedToken } from './actions/authSession';
import multer from 'multer';
import { MulterRequest } from './types/express';

const router = Router();
const upload = multer()

type SelectedOrdersProps = {
  order_id: number;
  shipping_id: number;
};

router.get('/', isAuthenticated , async (request: Request, response: Response) => {
  const authorizationHeader = request.headers.authorization;
  const [, token] = authorizationHeader.split(' ');
  const validation = await ValidatedToken(token)
  return response.json(validation)
})

router.post('/print', isAuthenticated, async (request: Request, response: Response) => {
  const body = request.body;
  const token = body.token;
  const selectOrders = body.selectedOrders as SelectedOrdersProps[];
  // Cria um novo documento PDF
  const doc = await PDFDocument.create();

  for (const { shipping_id, order_id } of selectOrders) {
      // Gera o PDF para o shipping_id e order_id
      const pdfBuffer = await zipFile(shipping_id, token);
      const order = await orderDetails(order_id, token);
      const declarationContent = await pdfmakeGenerate(order);

      if(pdfBuffer instanceof Error) return response.status(500).json(pdfBuffer.message)

      // Carrega os PDFs gerados
      const labelPdfDoc = await PDFDocument.load(pdfBuffer);
      const declarationPdfDoc = await PDFDocument.load(declarationContent);

      // Copia as páginas dos PDFs para o documento principal
      const firstPages = await doc.copyPages(labelPdfDoc, labelPdfDoc.getPageIndices());
      firstPages.forEach(page => doc.addPage(page));

      const secondPages = await doc.copyPages(declarationPdfDoc, declarationPdfDoc.getPageIndices());
      secondPages.forEach(page => doc.addPage(page));
  }

  // Salva o documento PDF final
  const pdfBytes = await doc.save();

  // Configura a resposta HTTP para retornar o PDF como um arquivo para download
  response.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="merged.pdf"',
      'Content-Length': pdfBytes.length,
  });

  response.end(pdfBytes);
});

router.post('/printlabel', upload.single('file'), async (request: MulterRequest, response:Response) => {
  try {
    // O arquivo enviado estará disponível como `request.file`
    const { file } = request;

    if (!file || !file.buffer) {
      return response.status(400).send('Nenhum arquivo enviado.');
    }

    // Chama a função printZipFile passando o buffer do arquivo ZIP
    const pdfBytes = await printZipFile(file.buffer);

    // Envia o PDF gerado como resposta
    response.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="label.pdf"',
      'Content-Length': pdfBytes.length,
    });

    response.end(pdfBytes);
  } catch (error) {
    console.error('Erro ao processar o arquivo:', error);
    response.status(500).send('Erro interno do servidor.');
  }
})

// router.post('/print', isAuthenticated, async (request: Request, response: Response) => {
 
//   const { order_id, shipping_id, token } = request.body;

//   const pdfBuffer = await zipFile(shipping_id, token)

//   const order = await orderDetails(order_id, token)

//   const declarationContent = await pdfmakeGenerate(order);

//   const firstPdfDoc = await PDFDocument.load(pdfBuffer);
//   const secondPdfDoc = await PDFDocument.load(declarationContent);

//   const doc = await PDFDocument.create();

//   const [firstPage] = await doc.copyPages(firstPdfDoc, [0]);
//   const [secondPage] = await doc.copyPages(secondPdfDoc, [0]);

//   doc.addPage(firstPage);
//   doc.insertPage(1, secondPage);

//   const pdfBytes = await doc.save();
  

//   response.set({
//     'Content-Type': 'application/pdf',
//     'Content-Disposition': 'attachment; filename="merged.pdf"',
//     'Content-Length': pdfBytes.length,
//   });

//   response.end(pdfBytes);
// });

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


