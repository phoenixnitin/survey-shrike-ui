import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private router:Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isUserLoggedIn()) {
      alert('You are not allowed to view this page. You are redirected to login Page');

      this.router.navigate(["home"]);
      return false;

      //var urlTree = this.router.createUrlTree(['login']);
      //return urlTree;
    }

    return true;
  }
}
