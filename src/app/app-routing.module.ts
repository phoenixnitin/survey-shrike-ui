import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {PreTrainingComponent} from "./pre-training/pre-training.component";
import {PostTrainingComponent} from "./post-training/post-training.component";
import {NotExistComponent} from "./not-exist/not-exist.component";
import {AuthGuardService} from "./shared/service/auth-guard.service";


const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'pre-training', component: PreTrainingComponent, canActivate: [AuthGuardService]},
  {path: 'post-training', component: PostTrainingComponent, canActivate: [AuthGuardService]},
  {path: '**', component: NotExistComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
