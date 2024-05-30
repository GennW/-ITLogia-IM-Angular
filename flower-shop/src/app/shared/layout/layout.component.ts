import { Component, OnInit } from '@angular/core';
import { CategotyService } from '../services/categoty.service';
import { CategoryWithTypeType } from 'src/app/types/categoryWithType.type ';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  categories: CategoryWithTypeType[] = [];


  constructor(private categoriesService: CategotyService) { }

  ngOnInit(): void {
    this.categoriesService.getCategoriesWithTypes()
    .subscribe((categories: CategoryWithTypeType[]) => {
      this.categories = categories.map(item => {
        // 1:18:40 Модуль №13. УРОК №5
        return Object.assign({typesUrl: item.types.map(item => item.url)}, item); 
      });
    });
  }

}
