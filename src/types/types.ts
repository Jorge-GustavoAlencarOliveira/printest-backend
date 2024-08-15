export interface Payment {
  reason: string;
  status_code: null;
  total_paid_amount: number;
  operation_type: string;
  transaction_amount: number;
  transaction_amount_refunded: number;
  date_approved: null | string;
  collector: {
    id: number;
  };
  coupon_id: null;
  installments: number;
  authorization_code: string;
  taxes_amount: number;
  id: number;
  date_last_modified: string;
  coupon_amount: number;
  available_actions: string[];
  shipping_cost: number;
  installment_amount: number;
  date_created: string;
  activation_uri: null;
  overpaid_amount: number;
  card_id: null;
  status_detail: string;
  issuer_id: string;
  payment_method_id: string;
  payment_type: string;
  deferred_period: null;
  atm_transfer_reference: {
    transaction_id: null;
    company_id: null;
  };
  site_id: string;
  payer_id: number;
  order_id: number;
  currency_id: string;
  status: string;
  transaction_order_id: null;
}

export interface OrderItem {
  item: {
    id: string;
    title: string;
    category_id: string;
    variation_id: null;
    seller_custom_field: null;
    global_price: null;
    net_weight: null;
    variation_attributes: any[];
    warranty: string;
    condition: string;
    seller_sku: null;
  };
  quantity: number;
  unit_price: number;
  full_unit_price: number;
  currency_id: string;
  manufacturing_days: null;
  picked_quantity: null;
  requested_quantity: {
    measure: string;
    value: number;
  };
  sale_fee: number;
  listing_type_id: string;
  base_exchange_rate: null;
  base_currency_id: null;
  bundle: null;
  element_id: number;
}

export interface Order {
  payments: Payment[];
  fulfilled: null;
  taxes: {
    amount: null;
    currency_id: null;
    id: null;
  };
  order_request: {
    change: null;
    return: null;
  };
  expiration_date: string;
  feedback: {
    buyer: null;
    seller: null;
  };
  shipping: {
    id: number;
  };
  date_closed: string;
  id: number;
  manufacturing_ending_date: null;
  order_items: OrderItem[];
  date_last_updated: string;
  last_updated: string;
  comment: null;
  pack_id: null;
  coupon: {
    amount: number;
    id: null;
  };
  shipping_cost: null;
  date_created: string;
  pickup_id: null;
  status_detail: null;
  tags: string[];
  buyer: {
    id: number;
    nickname: string;
  };
  seller: {
    id: number;
    nickname: string;
  };
  total_amount: number;
  paid_amount: number;
  currency_id: string;
  status: string;
  context: {
    application: null;
    product_id: null;
    channel: string;
    site: string;
    flows: any[];
  };
}

export type Orders = Order[];

//ShippingProps

interface Country {
  id: string;
  name: string;
}

interface Agency {
  carrier_id: null;
  phone: null;
  agency_id: null;
  description: null;
  type: null;
  open_hours: null;
}

interface City {
  id: string;
  name: string;
}

interface Municipality {
  id: null;
  name: null;
}

interface State {
  id: string;
  name: string;
}

interface Neighborhood {
  id: null;
  name: string;
}

interface ShippingAddress {
  country: Country;
  address_line: string;
  types: string[];
  scoring: number;
  agency: Agency;
  city: City;
  geolocation_type: string;
  latitude: number;
  address_id: number;
  municipality: Municipality;
  location_id: number;
  street_name: string;
  zip_code: string;
  geolocation_source: string;
  node: null;
  intersection: null;
  street_number: string;
  comment: null;
  state: State;
  neighborhood: Neighborhood;
  geolocation_last_updated: string;
  longitude: number;
}

interface Origin {
  shipping_address: ShippingAddress;
  type: string;
  sender_id: number;
  snapshot: {
    id: string;
    version: number;
  };
}

interface Destination {
  comments: null;
  receiver_id: number;
  receiver_name: string;
  shipping_address: ShippingAddress;
  type: string;
  receiver_phone: string;
  snapshot: {
    id: string;
    version: number;
  };
}

interface Source {
  site_id: string;
  market_place: string;
  customer_id: null;
  application_id: null;
}

interface LeadTime {
  processing_time: null;
  cost: number;
  estimated_schedule_limit: {
    date: null;
  };
  cost_type: string;
  estimated_delivery_final: {
    date: string;
    offset: number;
  };
  buffering: {
    date: null;
  };
  pickup_promise: {
    from: null;
    to: null;
  };
  list_cost: number;
  estimated_delivery_limit: {
    date: string;
    offset: number;
  };
  priority_class: {
    id: string;
  };
  delivery_promise: string;
  shipping_method: {
    name: string;
    deliver_to: string;
    id: number;
    type: string;
  };
  delivery_type: string;
  estimated_handling_limit: {
    date: string;
  };
  service_id: number;
  estimated_delivery_time: {
    date: string;
    pay_before: string;
    schedule: null;
    unit: string;
    offset: {
      date: string;
      shipping: number;
    };
    shipping: number;
    time_frame: {
      from: null;
      to: null;
    };
    handling: number;
    type: string;
  };
  option_id: number;
  estimated_delivery_extended: {
    date: string;
    offset: number;
  };
  currency_id: string;
}

export interface Shipment {
  snapshot_packing: {
    snapshot_id: string;
    pack_hash: string;
  };
  last_updated: string;
  items_types: string[];
  substatus: string;
  date_created: string;
  origin: Origin;
  destination: Destination;
  source: Source;
  tags: string[];
  declared_value: number;
  logistic: {
    mode: string;
    type: string;
    direction: string;
  };
  sibling: {
    reason: null;
    sibling_id: null;
    description: null;
    source: null;
    date_created: null;
    last_updated: null;
  };
  priority_class: {
    id: string;
  };
  lead_time: LeadTime;
  external_reference: null;
  tracking_number: string;
  id: number;
  tracking_method: string;
  quotation: null;
  status: string;
  dimensions: {
    height: number;
    width: number;
    length: number;
    weight: number;
  };
}

interface DestinationShipping {
  receiver_name: string;
    address_line: string;
    street_number: string;
    neighborhood: string;
    zip_code: string;
    city: string;
    state: string;
    country: string;
}

interface OriginShipping {
  username: string;
  address_line: string;
  street_number: string;
  neighborhood: string;
  city: string;
  zip_code: string;
  state: string;
  country: string;
}

export type dataLabeProps = {
  nf: string;
  shp: number;
  contrato: string;
  weight: number;
  tracking_number: string;
  tracking_method: string;
  destination: DestinationShipping;
  origin: OriginShipping
};

// Billing_Info

export interface BillingInfoResponse {
  billing_info: {
    additional_info: any[];
    doc_number: string;
    doc_type: 'CPF' | 'CNPJ';
  };
}