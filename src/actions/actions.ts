import { Shipment } from "../types/types";

export async function userDetails(accessToken: string) {
  if (!accessToken) return;

  try {
    const response = await fetch('https://api.mercadolibre.com/users/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      return console.log('Failed to fetch user info');
    }

    const userInfo = await response.json();

    return userInfo;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fectchShippingDetails(
  shipping_id: number,
  accessToken: string,
) {
  const user = await userDetails(accessToken);

  const response = await fetch(
    `https://api.mercadolibre.com/shipments/${shipping_id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'x-format-new': 'true',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.statusText}`);
  }

  const data = (await response.json()) as Shipment;

  console.log(data);

  let dataLabel = {
    nf: '',
    shp: data.id,
    contrato: '',
    tracking_number: data.tracking_number,
    tracking_method: data.tracking_method,
    weight: data.dimensions.weight,
    destination: {
      receiver_name: data.destination.receiver_name,
      address_line: data.destination.shipping_address?.address_line,
      street_number: data.destination.shipping_address?.street_number,
      neighborhood: data.destination.shipping_address?.neighborhood?.name,
      zip_code: data.destination.shipping_address?.zip_code,
      city: data.destination.shipping_address?.city?.name,
      state: data.destination.shipping_address?.state?.id,
      country: data.destination.shipping_address?.country?.id,
    },
    origin: {
      username: user.first_name + ' ' + user.last_name,
      address_line: data.origin.shipping_address?.address_line,
      street_number: data.origin.shipping_address?.street_number,
      neighborhood: data.origin.shipping_address?.neighborhood?.name,
      zip_code: data.origin.shipping_address?.zip_code,
      city: data.origin.shipping_address?.city?.name,
      state: data.origin.shipping_address?.state?.id,
      country: data.origin.shipping_address?.country?.id,
    },
  };
  

  var zpl = `^XA
  ^CI28
  ^LH5,15
  ^FO40,120^GFA,1485,1485,27,N07FFE,L01LF8,K01F8J03FgT078,K0F8L01EgS078,J03CN03CgR078,J0EP07gR078,I038P01CgQ078,I0ER07L01FC3F003F8007C1FE00FF007E781FE,0018K03F8J038K03FEFF80FFE01FC3FF81FFC1FF787FF8007K01IFK0CK07JFC1IF03FC7FFC3FFE3IF8IFC00FCJ07803EJ0EK0KFE1IF87FCIFC7E7E3IF8IFC018FC003EI07C00798J0F8FE3E3E0F87E1F87E7C1E7E1F9F03E0301FC3F8I01IFE0CI01F07C1E3C07CFC1F03E781E7C0F9F03E06001FFBK01FE004I01E07C1F7C07CF81FK03E7C0F9E01E0CK0601FM02I01E0781F7IFCF81FJ0FFE7807BE01!08K0C07BCL03I01E0781F7IFCF81EI03FFE7807BE01!18J0180E0EL018001E0781F7IFCF81EI07FDE7807BE01!3K0303803M08001E0781F7CI0F81FI07C1E7807BE01!2K02070018L0C001E0781F7CI0F81F03EF81E7C0F9E01E2K039CI0EL04001E0781F3EI0F81F03EF83E7C0F9F03E6K01F8I07L04001E0781F3F0F8F81F87CF83E7E1F1F87E4Q018K06001E0781F1IF8F80IFC7FFE3IF0IFC4R0CK02001E0781F0IF0F807FF87FFC1FFE07FF87CQ06J01E001E0781F07FE0F803FF03FF80FFC03FF,DFCP038001FEP01FL07800F8001EI078,C1F8O01C00FC2,C01EP0E07E02,C003C6N071F002R0878,CI0IF8J0301F8002Q03878,CI031FEJ0180CI06Q07878,6I03083EJ0C04I06Q07878,6I030037J0606I06Q07878,6I03I018I0304I0EQ078,7I01900180101DCI0CQ07879E01E0F83F8,3J0F00180180F8001CQ07879F03E3F8FFE,38I01001F00C0CI01CQ07879F07C7F9IF,3CI01800380618I038Q07878F07CFFBF1F8,1CJ0F801903B8I078Q07878F878FC3E0F8,1EJ03800881EJ0FR07878F8F9F03C078,0FK0EC0843J01FR0787878F9F07C07C,07CJ07C0877J03ER0787878F1F07IFC,03EK061C7CJ07CR078787CF1E07IFC,03FK03F7EJ01F8R078783DF1E07IFC,01FCK0CL03FS078783DE1E07C,00FFR0FES078781FE1E07C,003FCP03FCS078781FE1E03E078,001FFP0FF8S078781FC1E03F0F8,I0FFEN07FET078780FC1E01IF,I03FFCL07FFCT078780FC1E00IF,J0IFEJ0JFU078780F81E007FC,J03PFC,K07NFE,L0NF,M0LF,O07C,^FS
  ^FX Logo Service Correios^FS
  ^FO560,100^GFA,3021,3021,19,,:::::::::::V03FFE,U0LF8,T0NF8,S07OF,R03PFE,R0RFC,Q07SF,P01TFC,P03TFE,P0VF8,O01VFE,O07WF,O0XF8,N01XFE,N07YF,N0gF8,M01gFC,M03gFE,M07gGF,M0gHF8,L01gHFC,L03gHFE,L07gIF,:L0gJF8,K01gJFC,K03gJFE,:K07gKF,K07gKF8,K0gLF8,J01gLFC,:J03gLFE,:J07gMF,:J0gNF8,::I01gNFC,:I01gNFE,I03gNFE,::I03gOF,I07gOF,:::I07gOF8,I0gPF8,::::::::I0SFJ03RF8,I0QFCM0QF8,I0PF8O0PF8,I0OFCP01OF8,I0NFER03NF8,I0NF8S0NF8,I0MFCT01MF8,I0MFV07LF8,I0LFCV01LF8,I0LF8W07KF8,I0KFEX03KF8,I0KF8Y0KF8,I0KFg07JF8,I0JFCg01JF8,I0JF8gG0JF8,I0JFgH07IF8,I0IFCgH01IF8,I0IF8gI0IF8,I0IFgJ07FF8,I0FFEgJ03FF8,I0FFCgJ01FF8,I0FF8gK0FF8,I0FFgL07F8,I0FEgL03F8,I0FCgL01F8,I0F8gM0F8,I0FgN078,I0FgN038,I0EgN038,I0CgN018,I08gO08,I08,,:::X0C,V0JF8,U07KF8,T03LFE,T0NF8,S03NFE,S0PF8,R01PFC,R03PFE,R07QF8,Q01RFC,Q03RFE,Q03SF,Q07SF8,Q0TF8,P01TFC,P03TFE,:P07UF,P07UF8,P0VF8,P0VFC,O01VFC,:O03VFE,:O03WF,O07WF,:::O07WF8,O0XF8,::::,::::::::::::^FS^FS
  ^PW799
  ^LL1239
  ^LS0
  ^FT32,256^XG000.GRF,1,1^FS
  ^FT544,256^XG001.GRF,1,1^FS
  ^FX Box Content^FS
  ^FO17,45^GB765,1155,2^FS
  ^FT290,270^BY216,216^BXN,5,200,0,0,1,_^FD394013410000039401107000005511010101797198982500000000000067059090032980000326                    00000038991247489-00.000000-00.000000|43636930013|^FS
  ^FT31,305^A0N,28,28^FDNF: ${dataLabel?.nf}^FS
  ^FT31,333^A0N,28,28^FDSHP: ${dataLabel?.shp}^FS
  ^FT570,305^A0N,29,28^FDPESO: ${dataLabel?.weight}g^FS
  ^FT280,305^A0N,28,28^FDContrato: ${dataLabel?.contrato}^FS
  ^FT370,335^A0N,28,28^FH^FD${dataLabel?.tracking_method}^FS
  ^FX Bar Code^FS
  ^FT120,510,0^BY3,3,0^BCN,120,Y,Y^FD${dataLabel?.tracking_number}^FS
  ^FT40,550^A0N,32,31^FDRecebedor:_____________^FS
  ^FT290,550^A0N,32,31^FD_________________^FS
  ^FT40,590^A0N,32,31^FDAssinatura:____________^FS
  ^FT380,590^A0N,32,31^FDDocumento:______________^FS
  ^FX Box Content^FS
  ^FO17,610^GB765,275,2^FS
  ^FX Black box with text
  ^FO17,610^GB195,0,40^FS
  ^FT30,640^FR^AC^A0N,30,29^FDDESTINATARIO^FS
  ^FX  Black box with text ^FS
  ^FX  Buyer shipping_addres info  ^FS
  ^FT50,677^A0N,28,27^FH^FD${dataLabel?.destination?.receiver_name}^FS
  ^FT50,705^A0N,28,27^FH^FD${dataLabel?.destination?.address_line},${dataLabel?.destination?.neighborhood}^FS
  ^FT50,730^A0N,28,27^FH^FD^FS
  ^FT50,755^A0N,28,27^FH^FD${dataLabel?.destination?.zip_code} ${dataLabel?.destination?.city} -${dataLabel?.destination?.state}^FS
  ^FT49,755^A0N,28,27^FD${dataLabel?.destination?.zip_code}^FS
  ^FX Bar Code Destination CEP ^FS
  ^FT50,875^BY3,2,110^BCN,,N,N^FD${dataLabel?.destination?.zip_code}^FS
  ^FX Bar Code Destination CEP^FS
  ^FX REMITENTE^FS
  ^FT30,920^A0N,32,31^FR^FDRemetente:^FS
  ^FT35,950^A0N,25,24^FH^FD${dataLabel?.origin?.username}^FS
  ^FT35,980^A0N,25,24^FH^FD${dataLabel?.origin?.address_line},${dataLabel?.origin?.neighborhood}^FS
  ^FT35,1035^A0N,25,24^FH^FD${dataLabel?.origin?.zip_code} ${dataLabel?.origin?.city} - ${dataLabel?.origin?.state}^FS
  ^FT34,1035^A0N,25,24^FD${dataLabel?.origin?.zip_code}^FS
  ^FO37,1045^GB726,0,1^FS
  ^FO37,1055^BY3^B3N,N,100,Y,N^FD${dataLabel?.shp}^FS
  ^PQ1,0,1,Y
  ^XZ
  ^XA^MCY^XZ`;

  const url = 'http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/';
  const responselabel = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/pdf',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: zpl,
  });

  if (!responselabel.ok) {
    throw new Error(`Erro na requisição: ${response.statusText}`);
  }

  const arrayBuffer = await responselabel.arrayBuffer();
  return Buffer.from(arrayBuffer);
}