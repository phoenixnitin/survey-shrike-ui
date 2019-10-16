import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {PreTrainingComponent} from "./pre-training/pre-training.component";
import {PostTrainingComponent} from "./post-training/post-training.component";
import {AuthGuardService} from "./shared/service/auth-guard.service";
import {EmailVerifyGuard} from "./shared/service/email-verify-guard.guard";


const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'pre-training', component: PreTrainingComponent, canActivate: [AuthGuardService, EmailVerifyGuard]},
  {path: 'post-training', component: PostTrainingComponent, canActivate: [AuthGuardService, EmailVerifyGuard]},
  {path: '**', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
