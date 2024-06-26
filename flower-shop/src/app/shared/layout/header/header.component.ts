import { Component, HostListener, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { DefaultResponseType } from 'src/app/types/default-response.type copy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CategoryWithTypeType } from 'src/app/types/categoryWithType.type ';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { ProductType } from 'src/app/types/product.type ';
import { environment } from 'src/environments/environment';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  searchField = new FormControl();
  products: ProductType[] = [];
  islogged: boolean = false;
  count: number = 0;
  // searchValue: string = '';
  serverStaticPath = environment.serverStaticPath;
  showedSearch: boolean = false;


  @Input() categories: CategoryWithTypeType[] = [];

  constructor(private authService: AuthService, private _snackBar: MatSnackBar, 
    private router: Router, private cartService: CartService, 
    private productService: ProductService,) {
    this.islogged = authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    
    // изменение в input 
    this.searchField.valueChanges
    .pipe(debounceTime(500))
    .subscribe( value => {
      if (value && value.length > 2) {
            this.productService.searchProducts(value)
            .subscribe((data: ProductType[]) => {
              this.products = data;
              this.showedSearch = true;
            });
          } else {
            this.products = [];
          }
    });



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

  // changeSearchValue(newValue: string) {
  //   this.searchValue = newValue;
  //   if (this.searchValue && this.searchValue.length > 2) {
  //     this.productService.searchProducts(this.searchValue)
  //     .subscribe((data: ProductType[]) => {
  //       this.products = data;
  //       this.showedSearch = true;
  //     });
  //   } else {
  //     this.products = [];
  //   }
  // }

  selectProduct(url: string) {
    this.router.navigate(['/product/' + url]);
    // this.searchValue = '';
    this.searchField.setValue('');
    this.products = [];
  }

  // отслеживание клика
  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.showedSearch && (event.target as HTMLElement).className.indexOf('search-product') === -1) {
        this.showedSearch = false;
    }
  }
 }
