import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { LoginResponseType } from "src/app/types/login-response.type";
import { DefaultResponseType } from "src/app/types/default-response.type copy";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService, private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const tokens = this.authService.getTokens();
        if (tokens && tokens.accessToken) {
            const authReq = req.clone({
                headers: req.headers.set('x-access-token', tokens.accessToken)
            });

            return next.handle(authReq)
            .pipe(
                catchError((error) => {
                    if (error.status === 401 && !authReq.url.includes('/login') && !authReq.url.includes('/refresh')) {
                        return this.handle401Error(authReq, next);
                    }
                    return throwError(() => error);
                })
            );
        }

        return next.handle(req);
    }

    private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.refresh()
            .pipe(
                switchMap((result: DefaultResponseType | LoginResponseType) => {
                    let error = '';
                    if ((result as DefaultResponseType).error !== undefined) {
                        error = (result as DefaultResponseType).message;
                    }
                    const refreshResult = result as LoginResponseType;
                    if (!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId) {
                        error = "Ошибка авторизации";
                    }

                    if (error) {
                        return throwError(() => new Error(error));
                    }

                    this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);

                    const authReq = req.clone({
                        headers: req.headers.set('x-access-token', refreshResult.accessToken),
                    });

                    return next.handle(authReq);
                }),
                catchError((error) => {
                    this.authService.removeTokens();
                    this.router.navigate(['']);
                    return throwError(() => error);
                })
            );
    }
}
