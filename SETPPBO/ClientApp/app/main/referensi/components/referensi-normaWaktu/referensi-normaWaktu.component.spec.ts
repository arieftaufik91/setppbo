import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefnormawaktuComponent } from './referensi-normaWaktu.component';

describe('RefnormawaktuComponent', () => {
  let component: RefnormawaktuComponent;
  let fixture: ComponentFixture<RefnormawaktuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefnormawaktuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefnormawaktuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
