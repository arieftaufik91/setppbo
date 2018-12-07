import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefCaraKirimFormComponent } from './ref-cara-kirim-form.component';

describe('RefCaraKirimFormComponent', () => {
  let component: RefCaraKirimFormComponent;
  let fixture: ComponentFixture<RefCaraKirimFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefCaraKirimFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefCaraKirimFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
