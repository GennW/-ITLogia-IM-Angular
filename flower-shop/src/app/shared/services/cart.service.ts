import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CartType } from 'src/app/types/cart.type  copy';
import { Observable, Subject, tap } from 'rxjs';
import { DefaultResponseType } from 'src/app/types/default-response.type copy';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private count: number = 0; //1:35:50
  count$: Subject<number> = new Subject<number>();

  constructor(private http: HttpClient) {}

  setCount(count: number) {
    this.count = count;
    // овещение всех слушателей
    this.count$.next(this.count)
  }

  getCart(): Observable<CartType | DefaultResponseType> {
    return this.http.get<CartType | DefaultResponseType>(
      environment.api + 'cart',
      {
        withCredentials: true,
      }
    );
  }

  getCartCount(): Observable<{ count: number } | DefaultResponseType> {
    return this.http
      .get<{ count: number } | DefaultResponseType>(
        environment.api + 'cart/count',
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap((data) => {
          //1:21:40 (1:36:50)
          if (!data.hasOwnProperty('error')) {
            
            this.setCount((data as { count: number }).count)
          }
        })
      );
  }

  updateCart(
    productId: string,
    quantity: number
  ): Observable<CartType | DefaultResponseType> {
    return this.http
      .post<CartType | DefaultResponseType>(
        environment.api + 'cart',
        { productId, quantity },
        { withCredentials: true }
      )
      .pipe(
        //1:44:40
        tap((data) => {
          // 1:22:10 Модуль №13. УРОК №8
          if (!data.hasOwnProperty('error')) {
            let count = 0;
            (data as CartType).items.forEach((item) => {
              count += item.quantity;
            });

            this.setCount(count);
          }
        })
      );
  }
}
