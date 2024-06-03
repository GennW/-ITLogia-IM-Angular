import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "../auth.service";
import { DefaultResponseType } from '../types/default-response.type copy';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

// Модуль №13. УРОК №8 
//33 minute
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const tokens = this.authService.getTokens();
        if (tokens && tokens.accsessToken) {
            const authReq = req.clone({
                headers: req.headers.set('x-access-token', tokens.accsessToken)
            });

            return next.handle(authReq)
            .pipe(
                catchError((error) => {
                    if (error.status === 401 && !authReq.url.includes('/login') && !authReq.url.includes('/refresh')) {
                        return this.handle401Error(authReq, next)
                    }
                    return throwError(() => error);
                })
            );
        }

        return next.handle(req);
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        this.authService.refresh()
        .pipe(
            switchMap(((result as DefaultResponseType).error !== undefined) {
                
            })
        )
    }
}