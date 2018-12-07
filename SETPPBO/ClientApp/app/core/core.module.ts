import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { UserListComponent } from "./user/components/user-list/user-list.component";
import { UserDetailComponent } from "./user/components/user-detail/user-detail.component";
import { UserFormComponent } from "./user/components/user-form/user-form.component";
import { UserModule } from "./user/user.module";
import { LayoutModule } from "./layout/layout.module";
import { RoleModule } from "./role/role.module";
import { RoleListComponent } from "./role/components/role-list/role-list.component";
import { MenuListComponent } from "./menu/components/menu-list/menu-list.component";
import { MenuModule } from "./menu/menu.module";
import { MenuFormComponent } from "./menu/components/menu-form/menu-form.component";
import { MenuDetailComponent } from "./menu/components/menu-detail/menu-detail.component";
import { RoleDetailComponent } from "./role/components/role-detail/role-detail.component";
import { RoleFormComponent } from "./role/components/role-form/role-form.component";
import { Page404Component } from "./layout/components/page-404/page-404.component";
import { PageErrorComponent } from "./layout/components/page-error/page-error.component";
import { Page401Component } from "./layout/components/page-401/page-401.component";
import { ActionRoleListComponent } from "./role/components/action-role-list/action-role-list.component";
import { ActionRoleFormComponent } from "./role/components/action-role-form/action-role-form.component";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";

const routes: Routes = [
  {
    path: "user",
    children: [
      { path: "", component: UserListComponent },
      { path: "form", component: UserFormComponent },
      { path: "list", component: UserListComponent },
      { path: ":id", component: UserDetailComponent }
    ],
    data: {
      // Uses static text (Home)
      breadcrumbs: "User Manager"
    }
  },
  {
    path: "role",
    children: [
      { path: "", component: RoleListComponent },
      { path: "form", component: RoleFormComponent },
      { path: ":id", component: RoleDetailComponent }
    ],
    data: {
      // Uses static text (Home)
      breadcrumbs: "Role Manager"
    }
  },
  {
    path: "action",
    children: [
      { path: "", component: ActionRoleListComponent },
      { path: "form", component: ActionRoleFormComponent }
    ],
    data: {
      // Uses static text (Home)
      breadcrumbs: "Access Manager"
    }
  },
  {
    path: "menu",
    children: [
      { path: "", component: MenuListComponent },
      { path: "form", component: MenuFormComponent },
      { path: ":id", component: MenuDetailComponent }
    ],
    data: {
      // Uses static text (Home)
      breadcrumbs: "Menu Manager"
    }
  },
  {
    path: "error",
    children: [
      { path: "", component: PageErrorComponent },
      { path: "404", component: Page404Component },
      { path: "401", component: Page401Component }
    ],
    data: {
      // Uses static text (Home)
      breadcrumbs: "Error"
    }
  }
];

@NgModule({
  imports: [
    // angular modules
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forChild(routes),
    // user-added modules
    UserModule,
    RoleModule,
    MenuModule,
    LayoutModule,
    FlexLayoutModule
  ],
  declarations: []
})
export class CoreModule {}
