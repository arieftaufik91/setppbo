import { Component, OnInit, ViewChild } from "@angular/core";
import { RoleService } from "../../services/role.service";
import { IRole } from "../../../user/models/role";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { Router } from "@angular/router";
import { MatDialog, MatSnackBar } from "@angular/material";
import { PuiConfirmDialogService } from "../../../../shared/pusintek-ui/components/pui-confirm-dialog/pui-confirm-dialog.service";
import { RoleFormComponent } from "../role-form/role-form.component";
import { IResultModel } from "../../../../shared/models/result-model";
import { PuiSnackbarService } from "../../../../shared/pusintek-ui/components/pui-snackbar/pui-snackbar.service";


@Component({
  selector: "app-role-list",
  templateUrl: "./role-list.component.html",
  styleUrls: ["./role-list.component.css"],
  providers: [RoleService]
})
export class RoleListComponent implements OnInit {
  
  role: IRole;
  allRoles: IRole[];
  tempRoles: IRole[];
  columns: any[];
  selected: any[] = [];
  showBar = "hide";
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private roleService: RoleService,
    private router: Router,
    private dialog: MatDialog,
    // public snackBar: MatSnackBar,
    private dialogsService: PuiConfirmDialogService,
    private snackbarService: PuiSnackbarService
  ) {}

  ngOnInit() {
    this.createData();
    // specify columns
    this.columns = [{ prop: "RoleId" }, { prop: "RoleName" }];
  }

  singleSelectCheck(row: any) {
    return this.selected.indexOf(row) === -1;
  }

  createData(): void {
    this.roleService.getAll().subscribe(result => {
      this.allRoles = result;
      this.tempRoles = [...result];
    });
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempRoles.filter(function(d) {
      return d.RoleName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.allRoles = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  onSelect(event: any) {
    // navigate to detail
    // this.router.navigate(["/role", event.selected[0].RoleId]);
    // console.log("selected", event.selected[0].RoleId);
    this.showBar = "show";
  }

  onDeleteClick() {
    this.checkSelected(true);
  }

  onEditClick() {
    this.checkSelected(false);
  }

  checkSelected(isDelete: boolean): void {
    let isSelected = this.selected.length > 0;
    if (!isSelected) {
      this.snackbarService.showSnackBar("info", "Pilih role terlebih dahulu!");
    } else {
      let role = this.selected[0];
      // do delete or edit
      if (isDelete) {
        //material confirm
        this.dialogsService
          .confirm("Konfirmasi", "Yakin mau menghapus role?")
          .subscribe(accept => {
            if (accept) {
              console.log("hapus");
              this.roleService.deleteRole(role).subscribe(
                result => {
                  this.allRoles.splice(this.allRoles.indexOf(role), 1);
                  this.snackbarService.showSnackBar("success", "Hapus role berhasil!");
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
        // edit
        this.openRoleEditDialog();
      }
    }
    this.selected = []; // clear selected
  }

  openRoleEditDialog() {
    let dialogRef = this.dialog.open(RoleFormComponent, {
      disableClose: true,
      data: this.selected[0]
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        // console.log("result edit", result);
        this.roleService.putRole(result).subscribe((result: IResultModel) => {
          // cari di list yang namanya origin
          this.allRoles = this.allRoles.map((role: IRole) => {
            if (role.RoleId == result.data.RoleId) {
              role = Object.assign({}, role, result.data);
            }

            return role;
          });

          this.snackbarService.showSnackBar();
        });
      }
    });
  }

  openRoleAddDialog() {
    let dialogRef = this.dialog.open(RoleFormComponent, {
      //width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log("role form dialog closed");
      if (result != null) {
        this.roleService.postRole(result).subscribe((result: IResultModel) => {
          // cek apakah sudah ada datanya
          let index = this.allRoles.filter(
            (role: IRole) => role.RoleName == result.data.RoleName
          );
          if (index.length > 0) {
            this.snackbarService.showSnackBar(
              "error",
              "Role " + result.data.RoleName + " sudah ada!"
            );
          } else {
            // belum ada
            this.allRoles.push(result.data);
            this.allRoles = this.allRoles.map((role: IRole) => {
              return role;
            });
            this.snackbarService.showSnackBar();
          }
        });
      }
    });
  }
/*
  showSnackBar(type: string = "success", msg: string = "") {
    if (type == "success") {
      msg = msg == "" ? "Simpan Berhasil" : msg;
    } else if (type == "error") {
      msg = msg == "" ? "Simpan Gagal" : msg;
    }
    let snackBarRef = this.snackBar.openFromComponent(PuiSnackbarComponent, {
      duration: 3000,
      data: { type: type, msg: msg }
    });
  }
  */
}
