import { Router } from 'express';
import { isAuthenticated } from './middlewares/isAuthenticated';
import multer from 'multer';
import { PrintLabelController } from './controllers/app/printLabel';
import { AuthSessionController } from './controllers/user/authSession';
import { LabelByZip } from './controllers/app/labelByZip';

const router = Router();
const upload = multer();

router.get('/', isAuthenticated, new AuthSessionController().handle);

router.post('/print', isAuthenticated, new PrintLabelController().handle);

router.post(
  '/printlabel',
  isAuthenticated,
  upload.single('file'),
  new LabelByZip().handle,
);

export { router };



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

