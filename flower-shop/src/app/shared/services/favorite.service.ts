import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponseType } from 'src/app/types/default-response.type copy';
import { FavoriteType } from 'src/app/types/favorite.type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  getFavorites(): Observable<FavoriteType[] | DefaultResponseType> {
    return this.http.get<FavoriteType[] | DefaultResponseType>(environment.api + 'favorites');
  }

  removeFavorite(productId: string): Observable<DefaultResponseType> {
    return this.http.delete<DefaultResponseType>(environment.api + 'favorites', {body: {productId}});
  }  
  
  addToFavorite(productId: string): Observable<FavoriteType[] | DefaultResponseType> {
    return this.http.post<FavoriteType[] | DefaultResponseType>(environment.api + 'favorites', {productId});
  }
}
