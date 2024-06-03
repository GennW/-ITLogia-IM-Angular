import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { UserService } from 'src/app/shared/services/user.service';
import { CartType } from 'src/app/types/cart.type  copy';
import { DefaultResponseType } from 'src/app/types/default-response.type copy';
import { DeliveryType } from 'src/app/types/delivery.type';
import { OrderType } from 'src/app/types/order.type';
import { PaymentType } from 'src/app/types/payment.type';
import { UserInfoType } from 'src/app/types/user-info.type';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
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

  constructor(
    private cartService: CartService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private orderSevice: OrderService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.updateDeliveryTypeValidations();
  }

  ngOnInit(): void {

    // получение данных корзины
    this.cartService
      .getCart()
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

      //получение данных о пользователе
      if (this.authService.getIsLoggedIn()) {
              this.userService.getUserInfo()
      .subscribe((data: UserInfoType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
  
        // отображаем сохраненные данные в форме
        const userInfo = data as UserInfoType;
        const paramsToUpdate = {
          firstName: userInfo.firstName ? userInfo.firstName : '',
          lastName: userInfo.lastName ? userInfo.lastName : '',
          phone: userInfo.phone ? userInfo.phone : '',
          fatherName: userInfo.fatherName ? userInfo.fatherName : '',
          paymentType: userInfo.paymentType ? userInfo.paymentType : PaymentType.cashToCourier,
          email: userInfo.email ? userInfo.email : '',
          street: userInfo.street ? userInfo.street : '',
          house: userInfo.house ? userInfo.house : '',
          entrance: userInfo.entrance ? userInfo.entrance : '',
          apartment: userInfo.apartment ? userInfo.apartment : '',
          comment: ''
        }
  
        this.orderForms.setValue(paramsToUpdate);
  
        if(userInfo.deliveryType) {
          this.deliveryType = userInfo.deliveryType;
        }
  
      });
      }


  }

  calculateTotal() {
    this.totalAmount = 0;
    this.totalCount = 0;

    if (this.cart) {
      this.cart.items.forEach((item) => {
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

  createOrder() {
    // 1:25 Модуль №13. УРОК №9 (1:30)
    if (this.orderForms.valid && this.orderForms.value.firstName && this.orderForms.value.lastName
      && this.orderForms.value.phone && this.orderForms.value.paymentType && this.orderForms.value.email
    ) {
      const paramsObject: OrderType = {
        deliveryType: this.deliveryType,
        firstName: this.orderForms.value.firstName,
        lastName: this.orderForms.value.lastName,
        phone: this.orderForms.value.phone,
        paymentType: this.orderForms.value.paymentType,
        email: this.orderForms.value.email,
      };
//1:32:50
      if (this.deliveryType === DeliveryType.delivery) {
        if (this.orderForms.value.street) {
          paramsObject.street = this.orderForms.value.street;
        }
        if (this.orderForms.value.apartment) {
          paramsObject.apartment = this.orderForms.value.apartment;
        }
        if (this.orderForms.value.house) {
          paramsObject.house = this.orderForms.value.house;
        }
        if (this.orderForms.value.entrance) {
          paramsObject.entrance = this.orderForms.value.entrance;
        }
      }

      if (this.orderForms.value.comment) {
        paramsObject.comment = this.orderForms.value.comment;
      }

      this.orderSevice.createOrder(paramsObject).subscribe({
        next: (data: OrderType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          this.dialogRef = this.dialog.open(this.popup);
          // если клик не по крестику закрыть
          this.dialogRef.backdropClick().subscribe(() => {
            this.router.navigate(['/']);
          });

          // оповестить хедер что значение поменялось
          this.cartService.setCount(0);
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
      this.orderForms.markAllAsTouched();
      this._snackBar.open('Заполните необходимые поля');
      
    }
  }

  closePopup() {
    this.dialogRef?.close();
    this.router.navigate(['/']);
  }
}
