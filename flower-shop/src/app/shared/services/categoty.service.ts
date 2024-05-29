import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CategoriesType } from 'src/app/types/categories.type';
import { environment } from 'src/environments/environment';
import { TypeType } from 'src/app/types/type.type';
import { CategoryWithTypeType } from 'src/app/types/categoryWithType.type ';

@Injectable({
  providedIn: 'root',
})
export class CategotyService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<CategoriesType[]> {
    return this.http.get<CategoriesType[]>(environment.api + 'categories');
  }

  getCategoriesWithTypes(): Observable<CategoryWithTypeType[]> {
    return this.http.get<TypeType[]>(environment.api + 'types').pipe(
      map((items: TypeType[]) => {
        const array: CategoryWithTypeType[] = [];

        items.forEach((item: TypeType) => {
          const foundItem = array.find(
            (arrayItem) => arrayItem.url === item.category.url
          );
          // 1:23 Модуль №13. УРОК №4
          if (foundItem) {
            foundItem.types.push({
              id: item.id,
              name: item.name,
              url: item.url,
            });
          } else {
            array.push({
              id: item.category.id,
              name: item.category.name,
              url: item.category.url,
              types: [
                {
                  id: item.id,
                  name: item.name,
                  url: item.url,
                },
              ],
            });
          }
        });

        return array;
      })
    );
  }
}
