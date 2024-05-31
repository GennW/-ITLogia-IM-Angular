import { Component, Input, OnInit } from '@angular/core';
import { ProductType } from 'src/app/types/product.type ';
import { environment } from 'src/environments/environment';
import { CartService } from '../../services/cart.service';
import { CartType } from 'src/app/types/cart.type  copy';
import { AuthService } from 'src/app/core/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FavoriteService } from '../../services/favorite.service';
import { DefaultResponseType } from 'src/app/types/default-response.type copy';
import { FavoriteType } from 'src/app/types/favorite.type';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  @Input() product!: ProductType;

  serverStaticPath = environment.serverStaticPath;
  count: number = 1;
  @Input() isLight: boolean = false;
  @Input() countInCart: number | undefined = 0;

  constructor(private cartService: CartService, private authService: AuthService,
    private _snackBar: MatSnackBar,
    private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    if (this.countInCart && this.countInCart > 1) {
      this.count = this.countInCart;
    }
  }

  addToCart() {
    this.cartService
      .updateCart(this.product.id, this.count)
      .subscribe((data: CartType) => {
        this.countInCart = this.count;
      });
  }

  updateCount(value: number) {
    this.count = value;

    if (this.countInCart) {
      this.cartService
        .updateCart(this.product.id, this.count)
        .subscribe((data: CartType) => {
          this.countInCart = this.count;
        });
    }
  }

  removeFromCart() {
    this.cartService
      .updateCart(this.product.id, 0)
      .subscribe((data: CartType) => {
        this.countInCart = 0;
        this.count = 1;
      });
  }

  updateFavorite() {
    if (!this.authService.getIsLoggedIn()) { //1:03 Модуль №13. УРОК №8
      this._snackBar.open('Для добавления в избранное необходимо авторизоваться');

      return
    }


    if (this.product.isInFavorite) {
      this.favoriteService.removeFavorite(this.product.id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
  
          throw new Error(data.message);
        }
  
        this.product.isInFavorite = false;
      })
    } else {
      this.favoriteService
        .addToFavorite(this.product.id)
        .subscribe((data: FavoriteType[] | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          this.product.isInFavorite = true;
        });
    }
  }
}
