import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AuthService } from './common/services/auth.service';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    canActivate() {
        if (!this.authService.isTokenExpired()) {
            // logged in so return true
            return true;
        }
        // not logged in so redirect to login page with the return url
        let url = environment.PARENT_APP_URL   
        window.open(url, '_self');
        return false;
    }
}