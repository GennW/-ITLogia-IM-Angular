import { DeliveryType } from "./delivery.type";
import { PaymentType } from "./payment.type";


export type OrderType = {
  deliveryType: DeliveryType,
  firstName: string,
  lastName: string,
  fatherName?: string,
  phone: string,
  paymentType: PaymentType,
  email: string,
  street?: string,
  house?: number,
  entrance?: number,
  apartment?: number,
  comment?: string,
  items?:
    {
        id: string,
        name: string,
        quantity: number,
        price: number,
        total: number
    }[],
};
