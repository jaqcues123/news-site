export type TruckStatus = "available" | "sold" | "pending";
export type TruckType = "wrecker" | "rollback" | "rotator";

export interface TruckSpecs {
  chassis: string;
  engine: string;
  boom: string;
  winch: string;
  additional_features: string[];
}

export interface Truck {
  id: string;
  title: string;
  description: string;
  price: number;
  status: TruckStatus;
  type: TruckType;
  images: string[];
  buildsheet_url: string;
  specs: TruckSpecs;
  created_at: string;
}

export interface Inquiry {
  id: string;
  truck_id: string;
  truck_title: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export interface InquiryFormData {
  truck_id: string;
  truck_title: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}
