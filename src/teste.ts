import { BillingInfoResponse, Order, Shipment } from './types/types';

const unzipper = require('unzipper');

export async function zipFile(shipping_id: number, access_token: string) {
  const apiResponse = await fetch(
    `https://api.mercadolibre.com/shipment_labels?shipment_ids=${shipping_id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );
  if (apiResponse.status === 400) {
    return new Error(`API response error: ${apiResponse.status}`);
  }

  const zipArrayBuffer = await apiResponse.arrayBuffer();
  const zipBuffer = new Uint8Array(zipArrayBuffer);

  const directory = await unzipper.Open.buffer(zipBuffer);

  const file = directory.files.find((file) => file.path.endsWith('.txt'));

  const fileBuffer = await file.buffer();
  const fileContent = fileBuffer.toString('utf8');

  const url = 'http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/';
  const responseLabel = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/pdf',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: fileContent,
  });

  if (!responseLabel.ok) {
    throw new Error(`Erro na requisição: ${responseLabel.statusText}`);
  }

  const arrayBuffer = await responseLabel.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function orderDetails(order_id: number, access_token: string) {
  const responseUser = await fetch('https://api.mercadolibre.com/users/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
      accept: 'application/json',
    },
  });

  if (!responseUser) {
    throw new Error(`Erro na requisição: ${responseUser.statusText}`);
  }

  const dataUser = await responseUser.json();

  const responseOrder = await fetch(
    `https://api.mercadolibre.com/orders/${order_id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!responseOrder) {
    throw new Error(`Erro na requisição: ${responseOrder.statusText}`);
  }

  const dataOrder = (await responseOrder.json()) as Order;

  const responseShipping = await fetch(
    `https://api.mercadolibre.com/shipments/${dataOrder.shipping.id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        'x-format-new': 'true',
      },
    },
  );

  if (!responseShipping) {
    throw new Error(`Erro na requisição: ${responseShipping.statusText}`);
  }

  const dataShipping = (await responseShipping.json()) as Shipment;


  const responseBilling = await fetch(
    `https://api.mercadolibre.com/orders/${order_id}/billing_info`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!responseBilling) {
    throw new Error(`Erro na requisição: ${responseBilling.statusText}`);
  }

  const dataBilling = (await responseBilling.json()) as BillingInfoResponse;

  let dataDeclaration = {
    total_amount: dataOrder?.total_amount,
    paid_amount: dataOrder?.paid_amount,
    tracking_number: dataShipping.tracking_number,
    destination: {
      receiver_name: dataShipping.destination?.receiver_name,
      address_line: dataShipping.destination?.shipping_address?.address_line,
      doc_number: dataBilling.billing_info?.doc_number,
      zip_code: dataShipping.destination?.shipping_address?.zip_code,
      city: dataShipping.destination?.shipping_address?.city?.name,
      state: dataShipping.destination?.shipping_address?.state?.name,
    },
    origin: {
      username: dataUser.first_name + ' ' + dataUser.last_name,
      address_line: dataShipping.origin?.shipping_address?.address_line,
      doc_number: dataBilling.billing_info?.doc_number,
      zip_code: dataShipping.origin?.shipping_address?.zip_code,
      city: dataShipping.origin?.shipping_address?.city?.name,
      state: dataShipping.origin?.shipping_address?.state?.name,
    },
    products: [...dataOrder?.order_items],
  };

  return dataDeclaration;
}



export async function printZipFile (importFile: Buffer){

  const directory = await unzipper.Open.buffer(importFile);

  const file = directory.files.find((file) => file.path.endsWith('.txt'));

  const fileBuffer = await file.buffer();
  const fileContent = fileBuffer.toString('utf8');

  const url = 'http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/';
  const responseLabel = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/pdf',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: fileContent,
  });

  if (!responseLabel.ok) {
    throw new Error(`Erro na requisição: ${responseLabel.statusText}`);
  }

  const arrayBuffer = await responseLabel.arrayBuffer();
  return Buffer.from(arrayBuffer);
}