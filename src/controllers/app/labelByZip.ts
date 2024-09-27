import { Response } from 'express';
import { MulterRequest } from '../../types/multer';
import { printFile } from '../../teste';

export class LabelByZip {
  async handle(request: MulterRequest, response: Response) {
    try {

      const { file } = request;
      const { type } = request.body;
      
      if (!file || !file.buffer) {
        return response.status(400).send('Nenhum arquivo enviado.');
      }

      const pdfBytes = await printFile(file.buffer, type);

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
  }
}
