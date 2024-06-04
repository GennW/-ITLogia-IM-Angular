import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/services/order.service';
import { OrderStatusUtil } from 'src/app/shared/utils/order-status.util';
import { DefaultResponseType } from 'src/app/types/default-response.type copy';
import { OrderType } from 'src/app/types/order.type';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: OrderType[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {

    this.orderService.getOrders()
    .subscribe((data: OrderType[] | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        throw new Error((data as DefaultResponseType).message);
      }

      // 42:00 Модуль №13. УРОК №11
      this.orders = (data as OrderType[]).map(item => {
       const status = OrderStatusUtil.getStatusAndColor(item.status);
        
        item.statusRus = status.name;
        item.color = status.color;

        return item;
      });

    });
  }

}
