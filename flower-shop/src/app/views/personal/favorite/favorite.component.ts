import { Component, Input, OnInit } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { CartType } from 'src/app/types/cart.type  copy';
import { DefaultResponseType } from 'src/app/types/default-response.type copy';
import { FavoriteType } from 'src/app/types/favorite.type';
import { ProductType } from 'src/app/types/product.type ';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
})
export class FavoriteComponent implements OnInit {
  @Input() product!: ProductType;
  @Input() isLight: boolean = false;
  count: number = 1;

  products: FavoriteType[] = [];
  serverStaticPath = environment.serverStaticPath;

  constructor(
    private favoriteService: FavoriteService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.favoriteService
      .getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }

        this.products = data as FavoriteType[];
      });
  }

  removeFromFavorite(id: string) {
    this.favoriteService
      .removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          throw new Error(data.message);
        }

        this.products = this.products.filter((item) => item.id !== id);
      });
  }

  addToCart() {
    // console.log(this.product.id)
    console.log('In cart: ' + this.count);
    // this.cartService.updateCart(this.product.id, this.count )
    // .subscribe((data: DefaultResponseType | CartType) => {

    // })
  }

  updateCount(value: number) {
    this.count = value;
  }
}
