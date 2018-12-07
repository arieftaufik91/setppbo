import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule, MatTooltipModule, MatInputModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { WingToolbarComponent } from './components/wing-toolbar/wing-toolbar.component';
import { WingButtonCrudComponent } from './components/wing-button-crud/wing-button-crud.component';
import { WingButtonIconComponent } from './components/wing-button-icon/wing-button-icon.component';
import { WingDividerVerticalComponent } from './components/wing-divider-vertical/wing-divider-vertical.component';
import { WingSearchComponent } from './components/wing-search/wing-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    BrowserModule
  ],
  declarations: [WingToolbarComponent, WingButtonCrudComponent, WingButtonIconComponent, WingDividerVerticalComponent, WingSearchComponent],
  exports: [WingToolbarComponent]
})
export class WingModule { }

