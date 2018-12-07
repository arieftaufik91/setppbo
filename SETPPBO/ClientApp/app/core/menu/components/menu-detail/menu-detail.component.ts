import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { IMenuItemModel } from '../../../../shared/models/menu-item';
import { MenuService } from '../../services/menu.service';
import 'rxjs/add/operator/switchMap';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MenuFormComponent } from '../menu-form/menu-form.component';

@Component({
  selector: "app-menu-detail",
  templateUrl: "./menu-detail.component.html",
  styleUrls: ["./menu-detail.component.css"],
  providers: [MenuService]
})
export class MenuDetailComponent implements OnInit {
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private menuService: MenuService,
    public dialog: MatDialog
  ) {}

  /**
   * Properties
   */
  menuItemModel: IMenuItemModel;
  allMenus: IMenuItemModel[];

  ngOnInit() {
    // get menu item model from service
    // note: api/menu -> ambil semua sys menu
    // get user by id
    this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.menuService.getSysMenuById(+params.get("id")!)
      )
      .subscribe(result => (this.menuItemModel = result));

    // get all menus
    this.menuService.getAllMenus().subscribe(result => {
      // result -> MenuItemModel[]
      // ambil yang memenuhi parameter untuk menjadi parent name
      this.allMenus = result.filter((item: IMenuItemModel) => item.Type == "group" || item.Type == "collapse");
    });
  }

  goBack(): void {
    this.location.back();
  }

  openMenuDialog(): void {
    let dialogRef = this.dialog.open(MenuFormComponent, {
      // width: '500px',
      data: {
        model: this.menuItemModel,
        menus: this.allMenus
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed", result);
      // sudah pasti put
      // put operation
    });
  }
}
