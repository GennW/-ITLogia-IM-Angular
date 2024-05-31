import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { DefaultResponseType } from 'src/app/types/default-response.type copy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CategoryWithTypeType } from 'src/app/types/categoryWithType.type ';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  islogged: boolean = false;
  count: number = 0;

  @Input() categories: CategoryWithTypeType[] = [];

  constructor(private authService: AuthService, private _snackBar: MatSnackBar, 
    private router: Router, private cartService: CartService) {
    this.islogged = authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLogged: boolean) => {
      this.islogged = isLogged;
    });

    this.cartService.getCartCount()
    .subscribe((data: { count: number } | DefaultResponseType) => {

      if ((data as DefaultResponseType).error !== undefined) {
        throw new Error((data as DefaultResponseType).message);
      }

      this.count = (data as { count: number }).count;
    });
    this.cartService.count$
    .subscribe(count => {
      this.count = count;
    })
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: (data: DefaultResponseType) => {
        // next: (data: DefaultResponseType) => {
          // if (data.error) {
          //   this._snackBar.open('Ошибка выхода из системы');
          //   throw new Error(data.message);
          // }

          this.doLogout();
        },
        error: () => {
          this.doLogout();
        }
        // error: (errorResponse: HttpErrorResponse) => {
        //   if (errorResponse.error && errorResponse.error.message) {
        //     this._snackBar.open(errorResponse.error.message)
        //   } else {
        //     this._snackBar.open('Ошибка выхода из системы')
        //   }
        // }
      })
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

}
