import { Response } from 'express';
import { MulterRequest } from '../../types/multer';
import { printZipFile } from '../../teste';

export class LabelByZip {
  async handle(request: MulterRequest, response: Response) {
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
  }
}
