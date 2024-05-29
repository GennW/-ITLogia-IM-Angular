import { Component, Input, OnInit } from '@angular/core';
import { CategotyService } from '../../services/categoty.service';
import { CategoriesType } from 'src/app/types/categories.type';
import { AuthService } from 'src/app/core/auth.service';
import { DefaultResponseType } from 'src/app/types/default-response.type copy';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  islogged: boolean = false;

  @Input() categories: CategoriesType[] = [];

  constructor(private authService: AuthService, private _snackBar: MatSnackBar, private router: Router) {
    this.islogged = authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLogged: boolean) => {
      this.islogged = isLogged;
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
