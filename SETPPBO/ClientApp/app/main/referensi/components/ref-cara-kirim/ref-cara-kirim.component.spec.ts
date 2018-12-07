import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefCaraKirimComponent } from './ref-cara-kirim.component';

describe('RefCaraKirimComponent', () => {
  let component: RefCaraKirimComponent;
  let fixture: ComponentFixture<RefCaraKirimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefCaraKirimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefCaraKirimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
