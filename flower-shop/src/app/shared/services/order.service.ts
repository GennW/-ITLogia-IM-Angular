import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { DefaultResponseType } from 'src/app/types/default-response.type copy';
import { OrderType } from 'src/app/types/order.type';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  count: number = 0;
  count$: Subject<number> = new Subject<number>();

  constructor(private http: HttpClient) { }


  createOrder(params:OrderType): Observable<OrderType | DefaultResponseType> {
    return this.http.post<OrderType | DefaultResponseType>(environment.api + 'orders', params, { withCredentials: true })
  }

  getOrders(): Observable<OrderType[] | DefaultResponseType> {
    return this.http.get<OrderType[] | DefaultResponseType>(environment.api + 'orders')
  }
}
