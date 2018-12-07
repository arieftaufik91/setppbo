import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from "@angular/flex-layout";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    data: {
      // Uses static text (Home)
      breadcrumbs: "Home"
    }
  }
];

@NgModule({
  imports: [
      CommonModule,
      FlexLayoutModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
