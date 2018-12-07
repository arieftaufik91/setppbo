import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutMainComponent, LayoutContentComponent, LayoutSearchBarComponent } from './components/layout-main/layout-main.component';
import { LayoutNavComponent } from './components/layout-nav/layout-nav.component';
import { LoaderComponent } from './components/loader/loader.component';
import { RouterModule } from '@angular/router';
import { MatToolbarModule, MatSidenavModule, MatButtonModule, MatListModule, MatMenuModule, MatCardModule, MatProgressBarModule, MatIconModule, MatInputModule } from '@angular/material';
import { LoaderService } from './components/loader/loader.service';
import { httpServiceFactory } from '../../shared/services/http-service.factory';
import { XHRBackend, RequestOptions } from '@angular/http';
import { HttpService } from "../../shared/services/http.service";
import { PanelMenuModule, BreadcrumbModule } from 'primeng/primeng';
import { NavMenuModule } from "./components/layout-nav/nav-menu.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Page404Component } from './components/page-404/page-404.component';
import { PageErrorComponent } from './components/page-error/page-error.component';
import { Page401Component } from './components/page-401/page-401.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { McBreadcrumbsModule } from "ngx-breadcrumbs";

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
  };
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
    FormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatCardModule,
    MatProgressBarModule,
    PanelMenuModule,
    BreadcrumbModule,
    NavMenuModule,
    MatInputModule,
    BrowserModule,
      BrowserAnimationsModule,
    McBreadcrumbsModule
  ],
  declarations: [
    LayoutMainComponent,
    LayoutContentComponent,
    LayoutSearchBarComponent,
    LayoutNavComponent,
    LoaderComponent,
    Page404Component,
    PageErrorComponent,
    Page401Component
  ],
  exports: [LayoutMainComponent, LoaderComponent, LayoutSearchBarComponent],
  providers: [
    LoaderService,
    {
      provide: HttpService,
      useFactory: httpServiceFactory,
      deps: [XHRBackend, RequestOptions, LoaderService]
    }
  ]
})
export class LayoutModule {}
