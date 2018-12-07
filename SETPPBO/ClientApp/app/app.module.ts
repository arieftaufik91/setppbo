import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { AuthService } from './shared/services/auth.service';
import { HttpService } from "./shared/services/http.service";
import { MainModule } from './main/main.module';
import { McBreadcrumbsModule } from "ngx-breadcrumbs";
import { MAT_DATE_LOCALE } from '@angular/material';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    CoreModule,
    MainModule,
    RouterModule.forRoot([
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full"
      },
      { path: "**", redirectTo: "error/404" }
    ]),
    McBreadcrumbsModule.forRoot()
  ],
  providers: [AuthService, { provide: Http, useClass: HttpService }, {provide: MAT_DATE_LOCALE, useValue: 'id'}]
})
export class AppModuleShared {}
