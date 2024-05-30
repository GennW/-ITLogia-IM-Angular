import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { CartType } from 'src/app/types/cart.type  copy';
import { ProductType } from 'src/app/types/product.type ';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
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

  constructor(private productService:ProductService, private activatedRout: ActivatedRoute,
    private cartService: CartService
  ) { }

  ngOnInit(): void {

    this.activatedRout.params.subscribe(params => {
      this.productService.getProduct(params['url']).subscribe({
        next: (data: ProductType) => {

          this.cartService.getCart()
          .subscribe((cartData: CartType) => {
            if (cartData) {
              const productInCart = cartData.items.find(item => item.product.id === data.id); //1:30:30
              if (productInCart) {
                data.countInCart = productInCart.quantity;
                this.count = data.countInCart;
              }
            }
            
            this.product = data;
          });
        },
        error: error => {
          this.error = 'Failed to retrieve product information. Please try again later.';
        }
      });
    });
    


    this.productService.getBestProducts()
    .subscribe((data: ProductType[]) => {
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
}
