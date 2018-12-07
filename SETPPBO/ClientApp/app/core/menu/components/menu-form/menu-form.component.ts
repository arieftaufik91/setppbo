import { Component, OnInit, Inject } from "@angular/core";
import {
  IMenuItemModel,
  MenuItemModel
} from "../../../../shared/models/menu-item";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { AuthService } from "../../../../shared/services/auth.service";
import { IRole } from "../../../user/models/role";

@Component({
  selector: "app-menu-form",
  templateUrl: "./menu-form.component.html",
  styleUrls: ["./menu-form.component.css"]
})
export class MenuFormComponent implements OnInit {
  formModel: IMenuItemModel;
  formGroup: FormGroup;
  formTitle: string;

  selectedRoles: any[];
  allRoles: IRole[] = [];
  allMenus: IMenuItemModel[];
  refTypes = [
    { value: "item", viewValue: "Item" },
    { value: "group", viewValue: "Group" },
    { value: "collapse", viewValue: "Collapse" }
  ];
  //refParents: any[] = [];

  isGroupType: boolean = false;
  isCollapseType: boolean = false;
  isEdit = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<MenuFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm();
    // transfer data to form model
    this.allMenus = this.data.menus;
    this.allRoles = this.authService.allRoles;
  }

  ngOnInit() {
    let pName = this.data.pName;
    if (pName != null) {
      // add child
      this.refTypes = this.refTypes.filter(x => x.value != "group");
    }

    this.setFormValues();
    if (this.formModel != null) {
      this.isEdit = true;
      
      let arrRoles: string[] = this.data.userRoles != null ? this.data.userRoles.split(";") : [];
      this.allRoles.forEach(role => {
        role.IsChecked = false;
        arrRoles.forEach(roleStr => { 
          if (role.RoleName == roleStr) {
            role.IsChecked = true;
          }
        });
      });
    }
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      name: ["", Validators.required],
      link: "",
      icon: "",
      type: ["", Validators.required],
      roles: "",
      pName: "",
      order: 1,
      exact: true
    });
  }

  setFormValues() {
    if (this.data.model != null) {
      // edit
      this.formModel = this.data.model;
      // set value
      this.formGroup.setValue({
        name: this.formModel.Name,
        link: this.formModel.Link,
        icon: this.formModel.Icon,
        type: this.formModel.Type,
        roles: this.formModel.Roles,
        pName: this.formModel.ParentName,
        order: this.formModel.Order,
        exact: this.formModel.Exact == null ? true : this.formModel.Exact
      });

      // set booleans
      this.isGroupType = this.formModel.Type == "group";
      this.isCollapseType = this.formModel.Type == "collapse";
    }
  }

  onOkClick() {
    // simpan
    let model = this.prepareModelForSaving();

    this.dialogRef.close(model);
  }

  prepareModelForSaving() {
    let result = new MenuItemModel();
    // assign value
    result.Name = this.formGroup.controls["name"].value;
    result.Link = this.formGroup.controls["link"].value;
    result.Icon = this.formGroup.controls["icon"].value;
    result.Type = this.formGroup.controls["type"].value;
    result.Roles = this.formGroup.controls["roles"].value;
    result.ParentName = this.formGroup.controls["pName"].value; //this.data.pName
    if (this.data.pName != null) {
      result.ParentName = this.data.pName;
    }
    result.Exact = this.formGroup.controls["exact"].value;
    result.Order = this.formGroup.controls["order"].value;
    if (this.data.model != null) {
      result.MenuId = this.formModel.MenuId;
    }
    return result;
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onTypeChange() {
    let typeVal = this.formGroup.controls["type"].value;
    this.isGroupType = typeVal == "group";
    this.isCollapseType = typeVal == "collapse";
  }

  selectChange(list: any) {
    this.selectedRoles = list.selectedOptions.selected.map(
      (item: any) => item.value
    );

    // set into roles value
    this.formGroup.controls["roles"].setValue(this.selectedRoles.join(";"));
    this.formGroup.controls["roles"].markAsDirty();
  }
}
