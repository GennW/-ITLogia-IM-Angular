import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { DefaultResponseType } from 'src/app/types/default-response.type copy';
import { UserInfoType } from 'src/app/types/user-info.type';

@Injectable({
  providedIn: 'root',
})
export class UserService {


  constructor(private http: HttpClient) { }


  updateUserInfo(params: UserInfoType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'user', params)
  }

  getUserInfo(): Observable<UserInfoType | DefaultResponseType> {
    return this.http.get<UserInfoType | DefaultResponseType>(environment.api + 'user')
  }
}
