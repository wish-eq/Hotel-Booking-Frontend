// In interfaces.ts
export interface Hotel {
  id: string; // Keeping id as required for hotel objects
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  tel: string;
  picture: string;
}

export interface FormState {
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  tel: string;
  picture: string;
}
