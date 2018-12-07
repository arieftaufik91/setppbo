import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Location } from '@angular/common';
import { MatDialog } from "@angular/material";
import { UserFormComponent } from "../user-form/user-form.component";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  // styleUrls: ['./user-detail.component.scss'],
  providers: [UserService]
})
export class UserDetailComponent implements OnInit {

    user: User;
    formDialogOpened = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    // get user by id
    this.route.paramMap
      .switchMap((params: ParamMap) => this.userService.getUserByPegawaiId(params.get('id')!))
      .subscribe(result => this.user = result);
  }

  goBack(): void {
      this.location.back();
  }

  setRole(): void {
      console.log('setting role..');
      this.formDialogOpened = true;
  }

  getChipColor(role: string): string {
      return role == "Administrator" ? "primary" : "none";
  }

  openRoleDialog(): void {
      let dialogRef = this.dialog.open(UserFormComponent, {
          width: '500px',
          data: this.user      });

      dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed', result);
          if (result != null) {
              this.userService.postUserRoles(result).subscribe();
          } else {
              console.log('result is null');
          }
          //this.animal = result;
      });
  }
}
