import { Component, OnInit } from '@angular/core';
import { CategotyService } from 'src/app/shared/services/categoty.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { CategoryWithTypeType } from 'src/app/types/categoryWithType.type ';
import { ProductType } from 'src/app/types/product.type ';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  products: ProductType[] = [];
  categoriesWithTypes: CategoryWithTypeType[] = [];

  constructor(private productService: ProductService, private categoryService: CategotyService) { }

  ngOnInit(): void {
    this.productService.getProducts()
    .subscribe(data => {
      this.products = data.items;
    });

    this.categoryService.getCategoriesWithTypes()
    .subscribe(data => {
      this.categoriesWithTypes = data;
      // console.log(data);
    })

  }

}
