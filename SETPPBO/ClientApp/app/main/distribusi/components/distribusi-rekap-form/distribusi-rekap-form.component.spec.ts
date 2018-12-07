import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistribusiRekapFormComponent } from './distribusi-rekap-form.component';

describe('DistribusiRekapFormComponent', () => {
  let component: DistribusiRekapFormComponent;
  let fixture: ComponentFixture<DistribusiRekapFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistribusiRekapFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistribusiRekapFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
