import { OrderStatusType } from "src/app/types/order-staus.type";

export class OrderStatusUtil {
  static getStatusAndColor(status: OrderStatusType | undefined | null): { name: string, color: string } {
    let name = 'Новый';
    let color = '#456F49';

    switch (status) {
      case OrderStatusType.delivery:
        name = 'Доставка';
        break;
      case OrderStatusType.cancelled:
        name = 'Отменён';
        color = '#FF7575';
        break;
      case OrderStatusType.pending:
        name = 'Обработка';
        break;
      case OrderStatusType.pending:
        name = 'Выполнен';
        color = '#B6D5B9';
        break;
      default:
        break;
    }

    return { name, color }
  }
}