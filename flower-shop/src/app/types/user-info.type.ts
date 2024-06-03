import { DeliveryType } from "./delivery.type";
import { PaymentType } from "./payment.type";

//32:35 Модуль №13. УРОК №10
export type UserInfoType = {
  deliveryType?: DeliveryType,
  firstName?: string,
  lastName?: string,
  fatherName?: string,
  phone?: string,
  paymentType?: PaymentType,
  email: string,
  street?: string,
  house?: string,
  entrance?: string,
  apartment?: string,  
};
