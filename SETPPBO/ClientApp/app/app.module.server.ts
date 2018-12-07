import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModuleShared } from './app.module';
import { LayoutMainComponent } from './core/layout/components/layout-main/layout-main.component';
import { CoreModule } from './core/core.module';

@NgModule({
    bootstrap: [ LayoutMainComponent ],
    imports: [
        ServerModule,
        AppModuleShared,
        CoreModule
    ]
})
export class AppModule {
}
