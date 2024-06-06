import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
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
  @Input() count: number = 1;


  products: FavoriteType[] = [];
  favoriteProducts: FavoriteType[] | null = null;

  serverStaticPath = environment.serverStaticPath;
  @Input() countInCart: string | number | undefined = 0;

  cart: CartType | null = null;



  constructor(
    private favoriteService: FavoriteService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    
    // сначала запрашиваем корзину затем категории с типами , продукты и т.д. так как корзину может запросить не зарегистрированный пользователь
    this.cartService.getCart().subscribe((data: CartType | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        throw new Error((data as DefaultResponseType).message);
      }
      this.cart = data as CartType;

      // затем полчаем товары в избранном
      // если пользователь аторизован
      if (this.authService.getIsLoggedIn()) {
        this.favoriteService.getFavorites().subscribe({
          next: (data: FavoriteType[] | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              const error = (data as DefaultResponseType).message;
              // в случае ошибки показываем товары и категории
              // this.processCatalog();
              throw new Error(error);
            }

            //если ошибок нет то товары в избранном сохраняем в переменную
            this.favoriteProducts = data as FavoriteType[];
            // this.processCatalog();
          },
          error: (error) => {
            // если не получили например если нет авторизации или не получили избранное
            // показываем товары и категории
            // this.processCatalog();
          },
        });
        // если пользователь не авторизован просто показываем товары
      } else {
        // this.processCatalog();
      }
    });


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

  addToCart(product: FavoriteType) {

    
    if (product.count !== undefined) {
       this.cartService.updateCart(product.id, product.count)
      .subscribe((data: CartType | DefaultResponseType) => {

        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        
        product.inCart = true; // Устанавливаем, что продукт добавлен в корзину
        this.countInCart = product.id;
      });
    }
     
    // console.log(this.product.id)
    console.log('In cart: ' + this.count);
    // this.cartService.updateCart(this.product.id, this.count )
    // .subscribe((data: DefaultResponseType | CartType) => {

    // })
  }

  updateCount(value: number,product: FavoriteType) {
    this.count = value;
    product.count = value;
  }

  removeFromCart(product: FavoriteType) {
    this.cartService
      .updateCart(product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        product.inCart = false; // Устанавливаем, что продукт удален из корзины
        if (this.countInCart === product.id) {
          this.countInCart = 0; // Сбрасываем текущий продукт из корзины
        }
        this.count = 1;
      });
  }
}
