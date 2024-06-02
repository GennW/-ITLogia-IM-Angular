import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { CartType } from 'src/app/types/cart.type  copy';
import { DefaultResponseType } from 'src/app/types/default-response.type copy';
import { DeliveryType } from 'src/app/types/delivery.type';
import { OrderType } from 'src/app/types/order.type';
import { PaymentType } from 'src/app/types/payment.type';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  cart: CartType | null = null;
  serverStaticPath = environment.serverStaticPath;
  totalAmount: number = 0;
  totalCount: number = 0;
  deliveryType: DeliveryType = DeliveryType.delivery;
  deliveryTypes = DeliveryType;
  paymentTypes = PaymentType;

  orderForms = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: ['', Validators.required],
    fatherName: [''],
    paymentType: [PaymentType.cashToCourier, Validators.required],
    email: ['', [Validators.required, Validators.email]],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: [''],
    comment: [''],
  });

  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<any> | null = null;

  constructor(private cartService: CartService, private router: Router,
    private _snackBar: MatSnackBar, private fb: FormBuilder,
    private dialog: MatDialog, private orderSevice: OrderService
  ) {
    this.updateDeliveryTypeValidations();
  }

  ngOnInit(): void {
    this.cartService.getCart()
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.cart = data as CartType;
        if (!this.cart || (this.cart && this.cart.items.length === 0)) {
          this._snackBar.open('Корзина пуста ');
          this.router.navigate(['/']);
          return;
        }
        this.calculateTotal();
      });
  }

  calculateTotal() {
    this.totalAmount = 0;
    this.totalCount = 0;

    if (this.cart) {
      this.cart.items.forEach(item => {
        this.totalAmount += item.quantity * item.product.price;
        this.totalCount += item.quantity;
      });
    }
  }

  changeDeliveryType(type: DeliveryType) {
    this.deliveryType = type;
    this.updateDeliveryTypeValidations();
  }

  updateDeliveryTypeValidations() {
    // если доставка курьером
    if (this.deliveryType === DeliveryType.delivery) {
      this.orderForms.get('street')?.setValidators(Validators.required);
      this.orderForms.get('house')?.setValidators(Validators.required);
      // если доставка самовывоз
    } else {
      this.orderForms.get('street')?.removeValidators(Validators.required);
      this.orderForms.get('house')?.removeValidators(Validators.required);
      // очищаем если запонены
      this.orderForms.get('street')?.setValue('');
      this.orderForms.get('apartment')?.setValue('');
      this.orderForms.get('entrance')?.setValue('');
      this.orderForms.get('house')?.setValue('');
    }
    // применяем измененные валидаторы
    this.orderForms.get('street')?.updateValueAndValidity();
    this.orderForms.get('house')?.updateValueAndValidity();
  }

  createOrder() { // 1:25 Модуль №13. УРОК №9
    if (this.orderForms.valid) {
      this.orderSevice.createOrder({
        deliveryType: this.deliveryType,
        ...this.orderForms.value
      } as OrderType)
        .subscribe({
          next: (data: OrderType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message);
            }

            this.dialogRef = this.dialog.open(this.popup);
            // если клик не по крестику закрыть
            this.dialogRef.backdropClick()
              .subscribe(() => {
                this.router.navigate(['/']);
              });
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open(' ошибка заказа ');
            }
          },
        });
    } else {
      console.log('Заполните все поля')
    }
  }

  closePopup() {
    this.dialogRef?.close();
    this.router.navigate(['/']);
  }
}
