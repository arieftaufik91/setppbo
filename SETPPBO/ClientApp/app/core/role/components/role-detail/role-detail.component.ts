import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { MatDialog } from "@angular/material";
import { RoleService } from "../../services/role.service";
import { Location } from "@angular/common";
import "rxjs/add/operator/switchMap";

@Component({
  selector: "role-detail",
  templateUrl: "./role-detail.component.html",
  styleUrls: ["./role-detail.component.css"],
  providers: [RoleService]
})
export class RoleDetailComponent implements OnInit {
  role: any;

  constructor(
    private roleService: RoleService,
    private route: ActivatedRoute,
    private location: Location,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    // get role with action list
    this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.roleService.getById(params.get("id")!)
      )
      .subscribe(result => (this.role = result));
  }

  goBack(): void {
      this.location.back();
  }
}
