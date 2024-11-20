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
  
  export interface BookingRequest {
    bookingDate: string;
    checkoutDate: string;
    createdAt: string;
  }
  
  export interface Booking {
    _id: string;
    bookingDate: string;
    checkoutDate: string;
    user: string;
    hotel: {
      _id: string;
      name: string;
      address: string;
      tel: string;
      id: string;
    };
    createdAt: string;
  }