import { Component, OnInit, Inject } from '@angular/core';
import { IRole, RoleClass } from "../../../user/models/role";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: "app-role-form",
  templateUrl: "./role-form.component.html",
  styleUrls: ["./role-form.component.css"]
})
export class RoleFormComponent implements OnInit {
  role: RoleClass;
  roleForm: FormGroup;
  isEdit = false;

  constructor(
    public dialogRef: MatDialogRef<RoleFormComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm();
  }

  createForm() {
    this.roleForm = this.fb.group({
      roleName: ["", Validators.required]
    });
  }

  get roleName() {
    return this.roleForm.get("roleName");
  }

  ngOnInit() {
    // console.log('onInit RoleForm', this.data);
    if (this.data != null) {
      this.role = this.data;
      this.roleForm.setValue({
        roleName: this.role.RoleName
      });
      
      this.isEdit = true;
    } else {
      this.role = new RoleClass();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    //console.log('ok button clicked', this.role);
    this.role.RoleName = this.roleForm.controls['roleName'].value;
    this.dialogRef.close(this.role);
  }
}
