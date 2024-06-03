import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/shared/services/user.service';
import { DefaultResponseType } from 'src/app/types/default-response.type copy';
import { DeliveryType } from 'src/app/types/delivery.type';
import { PaymentType } from 'src/app/types/payment.type';
import { UserInfoType } from 'src/app/types/user-info.type';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
// 26:10 вместо переменной userInfoForms
  deliveryType: DeliveryType = DeliveryType.delivery;

  deliveryTypes = DeliveryType;
  paymentTypes = PaymentType;



  userInfoForms = this.fb.group({
    firstName: [''],
    lastName: [''],
    phone: [''],
    fatherName: [''],
    paymentType: [PaymentType.cashToCourier],
    // deliveryType: [DeliveryType.delivery],
    email: ['', Validators.required],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: ['']
  });

  constructor(private fb: FormBuilder, private userService: UserService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
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
        apartment: userInfo.apartment ? userInfo.apartment : ''
      }

      this.userInfoForms.setValue(paramsToUpdate);

      if(userInfo.deliveryType) {
        this.deliveryType = userInfo.deliveryType;
      }

    });
  }

  changeDeliveryType(deliveryType: DeliveryType) {
    this.deliveryType = deliveryType;
    // this.userInfoForms.get('deliveryType')?.setValue(deliveryType);
    //при выборе крьерои или самовывозом кнопка становиться активной
    this.userInfoForms.markAsDirty();
  }

  updateUserInfo() {
    if (this.userInfoForms.valid) {
      const paramObject: UserInfoType = {
        //36:30 Модуль №13. УРОК №10
        email: this.userInfoForms.value.email ? this.userInfoForms.value.email : '',
        deliveryType: this.deliveryType,
        paymentType: this.userInfoForms.value.paymentType ? this.userInfoForms.value.paymentType : PaymentType.cashToCourier,
      }

      if (this.userInfoForms.value.firstName) {
        paramObject.firstName = this.userInfoForms.value.firstName;
      }
      if (this.userInfoForms.value.lastName) {
        paramObject.lastName = this.userInfoForms.value.lastName;
      }
      if (this.userInfoForms.value.house) {
        paramObject.house = this.userInfoForms.value.house;
      }
      if (this.userInfoForms.value.fatherName) {
        paramObject.fatherName = this.userInfoForms.value.fatherName;
      }
      if (this.userInfoForms.value.phone) {
        paramObject.phone = this.userInfoForms.value.phone;
      }
      if (this.userInfoForms.value.street) {
        paramObject.street = this.userInfoForms.value.street;
      }
      if (this.userInfoForms.value.entrance) {
        paramObject.entrance = this.userInfoForms.value.entrance;
      }
      if (this.userInfoForms.value.apartment) {
        paramObject.apartment = this.userInfoForms.value.apartment;
      }
      
    this.userService.updateUserInfo(paramObject)
    .subscribe({
      next: (data: DefaultResponseType) => {
      if (data.error) {
        this._snackBar.open(data.message);
        throw new Error(data.message);
      }
      this._snackBar.open('Данные успешно сохранены');
      // деактивируем кнопку
      this.userInfoForms.markAsPristine();

      },
      error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message)
          } else {
            this._snackBar.open('Ошибка сохранения');
          }
        }
    });
      
    }
  }
}
