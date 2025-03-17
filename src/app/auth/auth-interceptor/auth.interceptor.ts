import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { AuthService } from "../auth-services/auth.service";
import { inject } from "@angular/core";



export function authInterceptor
(req: HttpRequest<unknown>, 
    next: HttpHandlerFn)
     {
            const token = inject(AuthService).token()
            if (!token) {
                return next(req);
               }
           // console.log({token});
        // clonacion de los token en los headers
            const newReq = req.clone({
            headers: req.headers.append('Authorization',`Bearer ${token}`),
            });
            return next(newReq);
    }
