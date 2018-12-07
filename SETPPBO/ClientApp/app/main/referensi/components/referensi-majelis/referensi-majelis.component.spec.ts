import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferensiMajelisComponent } from './referensi-majelis.component';

describe('ReferensiMajelisComponent', () => {
  let component: ReferensiMajelisComponent;
  let fixture: ComponentFixture<ReferensiMajelisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferensiMajelisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferensiMajelisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
