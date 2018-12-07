import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefnormawaktuFormComponent } from './referensi-normaWaktu-form.component';

describe('RefnormawaktuFormComponent', () => {
  let component: RefnormawaktuFormComponent;
  let fixture: ComponentFixture<RefnormawaktuFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefnormawaktuFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefnormawaktuFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
