import { Component, OnInit } from '@angular/core';
import { CategotyService } from '../services/categoty.service';
import { CategoriesType } from 'src/app/types/categories.type';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  categories: CategoriesType[] = [];


  constructor(private categoriesService: CategotyService) { }

  ngOnInit(): void {
    this.categoriesService.getCategories()
    .subscribe((categories: CategoriesType[]) => {
      this.categories = categories;
    })
  }

}
