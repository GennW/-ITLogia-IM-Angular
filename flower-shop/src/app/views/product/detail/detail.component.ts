import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService } from 'src/app/core/auth.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { CartType } from 'src/app/types/cart.type  copy';
import { DefaultResponseType } from 'src/app/types/default-response.type copy';
import { FavoriteType } from 'src/app/types/favorite.type';
import { ProductType } from 'src/app/types/product.type ';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  count: number = 1;
  product!: ProductType; // <div class="detail" *ngIf="product">
  recomendProducts: ProductType[] = [];
  error: string = '';
  serverStaticPath = environment.serverStaticPath;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 24,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
    },
    nav: false,
  };

  constructor(
    private productService: ProductService,
    private activatedRout: ActivatedRoute,
    private cartService: CartService,
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.activatedRout.params.subscribe((params) => {
      this.productService.getProduct(params['url']).subscribe({
        next: (data: ProductType) => {
          this.product = data;

          this.cartService.getCart().subscribe((cartData: CartType) => {
            if (cartData) {
              const productInCart = cartData.items.find(
                (item) => item.product.id === this.product.id
              ); //1:30:30
              if (productInCart) {
                this.product.countInCart = productInCart.quantity;
                this.count = this.product.countInCart;
              }
            }
          });
          if (this.authService.getIsLoggedIn()) {
            
          this.favoriteService.getFavorites()
            .subscribe((data: FavoriteType[] | DefaultResponseType) => {
              if ((data as DefaultResponseType).error !== undefined) {
                const error = (data as DefaultResponseType).message;
                throw new Error(error);
              }

              const products = data as FavoriteType[];
              const currentProductsExists = products.find(
                (item) => item.id === this.product.id
              );
              if (currentProductsExists) {
                this.product.isInFavorite = true;
              }
            });
          }

        },
        error: (error) => {
          this.error =
            'Failed to retrieve product information. Please try again later.';
        },
      });
    });

    this.productService.getBestProducts().subscribe((data: ProductType[]) => {
      this.recomendProducts = data;
    });
  }

  updateCount(value: number) {
    this.count = value;

    if (this.product.countInCart) {
      this.cartService
        .updateCart(this.product.id, this.count)
        .subscribe((data: CartType) => {
          this.product.countInCart = this.count;
        });
    }
  }

  addToCart() {
    this.cartService
      .updateCart(this.product.id, this.count)
      .subscribe((data: CartType) => {
        this.product.countInCart = this.count;
      });
  }

  removeFromCart() {
    this.cartService
      .updateCart(this.product.id, 0)
      .subscribe((data: CartType) => {
        this.product.countInCart = 0;
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
