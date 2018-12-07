import {
  Component,
  OnInit,
  Input,
  Inject,
  ChangeDetectorRef
} from "@angular/core";
import { User } from "../../models/user";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UserService } from "../../services/user.service";
import { IRole } from "../../models/role";
import { AuthService } from "../../../../shared/services/auth.service";

@Component({
  selector: "user-form",
  templateUrl: "./user-form.component.html",
  providers: [UserService]
  // styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  user: User;
  allRoles: IRole[];
  selected: any[];

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {} // data: Users

  ngOnInit() {
    this.allRoles = [];
    console.log("data", this.data);
    // get all
    let userRoles = this.data.roles;
    this.allRoles = this.compareRoles(userRoles, this.authService.allRoles);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    this.data.user.UserRoles = this.selected;
    this.dialogRef.close(this.data.user);
  }

  selectChange(list: any) {
    this.selected = list.selectedOptions.selected.map(
      (item: any) => item.value
    );
  }
/*
  onSliderChanged(event: any) {
    this.setSliderValue(event.source.ariaLabel, event.checked);
  }

  setSliderValue(sliderName: string, sliderValue: boolean) {
    // cari di all roles
    for (let role of this.allRoles) {
      if (role.RoleName == sliderName) {
        role.IsChecked = sliderValue;
      }
    }
  }
*/
  compareRoles(userRoles: string[], defaultRoles: IRole[]): IRole[] {
    var result: IRole[];
    result = [];

    for (let role of defaultRoles) {
      let newRole: IRole = {
        RoleId: role.RoleId,
        RoleName: role.RoleName,
        IsChecked: false
      };

      for (let userRole of userRoles) {
        if (role.RoleName == userRole) {
          newRole.IsChecked = true;
        }
      }

      result.push(newRole);
    }

    return result;
  }
}
