import { Request, Response } from 'express';
import { generatePdfLabel } from '../../utils/generatePdfLabel';

export class PrintLabelController {
  async handle(request: Request, response: Response) {
    const { token, selectedOrders } = request.body;

    const pdfBytes = await generatePdfLabel({ selectedOrders, token });

    if (typeof pdfBytes === 'string')
      return response.status(400).json(pdfBytes);

    response.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="merged.pdf"',
      'Content-Length': pdfBytes.length,
    });

    response.end(pdfBytes);
  }
}
