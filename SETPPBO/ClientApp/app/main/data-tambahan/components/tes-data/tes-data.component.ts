import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-tes-data',
  templateUrl: './tes-data.component.html',
  styleUrls: ['./tes-data.component.css']
})
export class TesDataComponent implements OnInit {
  invoiceForm: FormGroup;

  constructor(
    private _fb: FormBuilder
  ) {
    this.createForm();
  }
  createForm(){
    this.invoiceForm = this._fb.group({
      itemRows: this._fb.array([])
    });
    this.invoiceForm.setControl('itemRows', this._fb.array([]));
  }

  ngOnInit() {
    this.invoiceForm = this._fb.group({
      itemRows: this._fb.array([this.initItemRows()]) // here
    });
  }
  initItemRows() {
    return this._fb.group({
        // list all your form controls here, which belongs to your form array
        itemname: ['']
    });
}
addNewRow() {
  // control refers to your formarray
  const control = <FormArray>this.invoiceForm.controls['itemRows'];
  // add new formgroup
  control.push(this.initItemRows());
}
deleteRow(index: number) {
  // control refers to your formarray
  const control = <FormArray>this.invoiceForm.controls['itemRows'];
  // remove the chosen row
  control.removeAt(index);
}
}