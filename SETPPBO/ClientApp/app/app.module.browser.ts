import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppModuleShared } from './app.module';
import { CoreModule } from './core/core.module';
import { LayoutMainComponent } from './core/layout/components/layout-main/layout-main.component';

@NgModule({
    bootstrap: [ LayoutMainComponent ],
    imports: [
        BrowserModule,
        AppModuleShared,
        CoreModule
    ],
    providers: [
        { provide: 'BASE_URL', useFactory: getBaseUrl }
    ]
})
export class AppModule {
}

export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}
