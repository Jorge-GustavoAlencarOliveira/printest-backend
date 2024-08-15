import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { OrderItem } from '../types/types';
import { text } from 'express';

type Tdata = {
  total_amount: number;
  paid_amount: number;
  tracking_number: string;
  destination: {
    receiver_name: string;
    address_line: string;
    doc_number: string;
    zip_code: string;
    city: string;
    state: string;
  };
  origin: {
    username: string;
    address_line: string;
    doc_number: string;
    zip_code: string;
    city: string;
    state: string;
  };
  products: OrderItem[];
};

export async function pdfmakeGenerate(data: Tdata) {
  var PdfPrinter = require('pdfmake');
  var fonts = {
    Times: {
      normal: 'Times-Roman',
      bold: 'Times-Bold',
      italics: 'Times-Italic',
      bolditalics: 'Times-BoldItalic',
    },
  };
  var printer = new PdfPrinter(fonts);

  const items = data.products.map((item, index) => {
    return [
      { text: index + 1 },
      { text: item.item.title },
      { text: item.quantity },
      { text: item.unit_price },
    ];
  });

  var docDefinition: TDocumentDefinitions = {
    pageSize: {
      width: 290,
      height: 'auto'
    },
    pageMargins: [8,5,8,5],
    content: [
      {
        style: 'tableDefault',
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: 'DECLARAÇÃO DE CONTEÚDO',
                width: '100%',
                alignment: 'center',
                margin: [0, 0, 0, 2],
                border: [true, true, true, false],
                fontSize: 11,
                bold: true
              },
            ],
            [
              {
                text: `Codigo de rastreamento: ${data.tracking_number}`,
                decoration: 'underline',
                border: [true, false, true, true],
                width: '100%',
                alignment: 'center',
                margin: [0, 2, 0, 0],
                fontSize: 11,
                bold: true
              },
            ],
          ],
        },
      },
      {
        style: 'tableDefault',
        table: {
          heights: [12, 12, 20, 20, 20],
          widths: '*',
          body: [
            [
              { text: 'REMETENTE', colSpan: 2, alignment: 'center', bold: true },
              {},
              { text: 'DESTINATÁRIO', colSpan: 2, alignment: 'center', bold: true},
              {},
            ],
            [
              { text: `NOME: ${data?.origin?.username}`, colSpan: 2 },
              {},
              { text: `NOME: ${data?.destination?.receiver_name}`, colSpan: 2 },
              {},
            ],
            [
              { text: `ENDEREÇO: ${data?.origin?.address_line}`, colSpan: 2 },
              {},
              {
                text: `ENDEREÇO: ${data?.destination?.address_line}`,
                colSpan: 2,
              },
              {},
            ],
            [
              { text: `CIDADE: ${data?.origin?.city}` },
              { text: `UF: ${data?.origin?.state}` },
              { text: `CIDADE: ${data?.destination?.city}` },
              { text: `UF: ${data?.destination?.state}` },
            ],
            [
              { text: `CEP: ${data?.origin?.zip_code}` },
              { text: `CPF/CNPJ: ${data?.origin?.doc_number}` },
              { text: `CEP: ${data?.destination?.zip_code}` },
              { text: `CPF/CNPJ: ${data?.destination?.doc_number}` },
            ],
          ],
        },
      },
      {
        style: ['tableDefault', 'textCenter'],
        table: {
          widths: [25, '*', 35, 35],
          heights: 12,
          body: [
            [{ text: 'IDENTIFICAÇÃO DOS BENS', colSpan: 4, bold: true }, {}, {}, {}],
            [
              { text: 'ITEM', bold: true },
              { text: 'CONTEÚDO', bold: true },
              { text: 'QUANT', bold: true },
              { text: 'VALOR', bold: true },
            ],
            ...items,
            [{}, {}, {}, {}],
            [{}, {}, {}, {}],
            [{}, {}, {}, {}],
            [{}, {}, {}, {}],
            [{}, {}, {}, {}],
            [
              {
                text: 'VALOR TOTAL',
                colSpan: 2,
                fillColor: '#c9c9c9',
                alignment: 'right',
                bold: true
              },
              {},
              { text: `${items.length}` },
              { text: `${data.total_amount}` },
            ],
            [
              {
                text: 'PESO TOTAL (Kg)',
                colSpan: 2,
                fillColor: '#c9c9c9',
                alignment: 'right',
                bold: true
              },
              {},
              { text: '', colSpan: 2 },
              {},
            ],
          ],
        },
      },
      {
        style: 'tableDefault',
        table: {
          heights: ['auto', 50, 'auto'],
          widths: ['*'],
          body: [
            [{ text: 'D E C L A R A Ç Ã O', alignment: 'center', bold: true }],
            [
              {
                border: [true, true, true, false],
                width: '100%',
                text: [
                  '     Declaro que não me enquadro no conceito de contribuinte previsto no art. 4º da Lei Complementar nº 87/1996, uma vez que não realizo,com habitualidade ou em volume que caracterize intuito comercial, operações de circulação de mercadoria, ainda que se iniciem no exterior, ou estou dispensado da emissão da nota fiscal por força da legislação tributária vigente, responsabilizando-me, nos termos da lei e a quem de direito, por informações inverídicas.\n',
                  'Declaro ainda que não estou postando conteúdo inflamável, explosivo, causador de combustão espontânea, tóxico, corrosivo, gás ou qualquer outro conteúdo que constitua perigo, conforme o art. 13 da Lei Postal nº 6.538/78.\n',
                ],
                fontSize: 8,
                lineHeight: 1.3,
              },
            ],
            [
              {
                width: '100%',
                border: [true, false, true, true],
                text: [
                  '_________________, ____ de _________ de ______.     _____________________________\n',
                  'Assinatura do Declarante/Remetente',
                ],
                alignment: 'right',
                fontSize: 8,
                lineHeight: 2,
              },
            ],
          ],
        },
      },
      {
        table: {
          widths: '*',
          body: [
            [
              {
                text: 'OBSERVAÇÃO:\n Constitui crime contra a ordem tributária suprimir ou reduzir tributo, ou contribuição social e qualquer acessório (Lei 8.137/90 Art. 1º, V).',
                fontSize: 8,
                lineHeight: 1.5,
              },
            ],
          ],
        },
      },
    ],
    defaultStyle: {
      font: 'Times',
    },
    styles: {
      tableDefault: {
        margin: [0, 0, 0, 5],
        fontSize: 9,
      },
      textCenter: {
        alignment: 'center',
      },
    },
  };

  var pdfDoc = printer.createPdfKitDocument(docDefinition);

  const chunks: Uint8Array[] = [];

  pdfDoc.on('data', (chunk: Uint8Array) => {
    chunks.push(chunk);
  });

  pdfDoc.end();

  await new Promise<void>((resolve, reject) => {
    pdfDoc.on('end', () => {
      resolve();
    });
    pdfDoc.on('error', (err: Error) => {
      reject(err);
    });
  });

  const pdfArrayBuffer = Buffer.concat(chunks).buffer;

  return Buffer.from(pdfArrayBuffer);
}
