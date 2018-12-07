import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { MenuService } from "../../services/menu.service";
import { IMenuItemModel } from "../../../../shared/models/menu-item";
import { TreeNode, MenuItem, TreeDragDropService } from "primeng/primeng";
import { Router } from "@angular/router";
import { MenuFormComponent } from "../menu-form/menu-form.component";
import { MatDialog, MatSnackBar } from "@angular/material";
import { IResultModel } from "../../../../shared/models/result-model";
import { PuiConfirmDialogService } from "../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service";
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";

@Component({
  selector: "app-menu-list",
  templateUrl: "./menu-list.component.html",
  styleUrls: ["./menu-list.component.css"],
  providers: [MenuService, TreeDragDropService]
})
export class MenuListComponent implements OnInit {
  constructor(
    private menuService: MenuService,
    private router: Router,
    public dialog: MatDialog,
    private dialogsService: PuiConfirmDialogService,
    private snacbarService: PuiSnackbarService
  ) {}

  /* Properties */
  isItemSelected = false;
  menus: IMenuItemModel[] = [];
  temp: IMenuItemModel[];
  treeMenus: TreeNode[] = [];
  tempTreeMenus: TreeNode[];

  private cmItems: MenuItem[];
  selectedMenu: TreeNode;

  columns: any[];
  @ViewChild("arrowTemplate") arrowTemplate: TemplateRef<any>;

  ngOnInit() {
    // specify column
    this.columns = [
      {
        cellTemplate: this.arrowTemplate,
        width: "30"
      },
      { prop: "Name" },
      { prop: "Link" },
      { prop: "Icon" },
      { prop: "Exact" }
    ];

    this.loadTreeMenus();
  }

  loadTreeMenus() {
    // get all menu item
    this.menuService.getAllMenus().subscribe(result => {
      this.menus = result;
      this.temp = [...result];
      this.treeMenus = this.getChildTreeItems(result);
      // this.panelMenus = this.getChildPanelItems(result);
      // console.log("menus", result);
      this.tempTreeMenus = [...this.treeMenus];
    });
  }

  getChildTreeItems(items: IMenuItemModel[]): TreeNode[] {
    var result: TreeNode[] = [];
    if (items != null) {
      for (let child of items) {
        let node: TreeNode = {
          data: child,
          children: this.getChildTreeItems(child.Items)
        };
        result.push(node);
      }
    }
    return result;
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempTreeMenus.filter(function(d) {
      return d.data.Name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.treeMenus = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

  onAddClick() {
    let dialogRef = this.dialog.open(MenuFormComponent, {
      // width: '500px',
      data: { menus: this.menus }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log("The dialog was closed", result);
      let found = false;
      // pasti add
      if (result != null) {
        this.menuService
          .postSysMenu(result)
          .subscribe((response: IResultModel) => {
            
            this.loadTreeMenus();
            this.snacbarService.showSnackBar("success", "Menu berhasil ditambah!");
          });
      }
    });
  }

  onChildAddClick() {
    // add child
    // get selected name as parent name
    // console.log('selected parent name', this.selectedMenu.data.Name);
    let dialogRef = this.dialog.open(MenuFormComponent, {
      // width: '500px',
      data: { menus: this.menus, pName: this.selectedMenu.data.Name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.menuService
          .postSysMenu(result)
          .subscribe((response: IResultModel) => {
            
            this.loadTreeMenus();
            this.snacbarService.showSnackBar("success", "Menu berhasil ditambah!");
          });
      }
    });
  }

  onEditClick() {
      let dialogRef = this.dialog.open(MenuFormComponent, {
          data: { model: this.selectedMenu.data, menus: this.menus, userRoles: this.selectedMenu.data.Roles }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.menuService
          .putSysMenu(result)
          .subscribe((response: IResultModel) => {
            
            this.loadTreeMenus();
            this.snacbarService.showSnackBar("success", "Menu berhasil diubah!");
          });
      }
    });
  }

  onDeleteClick() {
    if (this.selectedMenu != null) {
      // proses delete
      this.dialogsService
        .confirm("Confirm Dialog", "Are you sure you want to do this?")
        .subscribe(accept => {
          if (accept) {
            console.log("hapus");
            this.menuService.deleteSysMenu(this.selectedMenu.data).subscribe(
              result => {
                
                this.loadTreeMenus();                
                this.snacbarService.showSnackBar("success", "Menu berhasil dihapus!");
              },
              error => {
                console.log("error happened");
              },
              () => {
                // on completed
                console.log("completed post");
              }
            );
          } else {
            console.log("batal hapus");
          }
        });
    } else {
      // ---
      this.snacbarService.showSnackBar("info", "pilih menu terlebih dahulu!");
    }
  }

  onNodeSelect(event: any) {
    // console.log('selected', event.node.data);
    let type = event.node.data.Type;
    this.isItemSelected = type == "item";
  }
}
