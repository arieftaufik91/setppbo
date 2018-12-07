import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefKodeTermohonFormComponent } from './ref-kode-termohon-form.component';

describe('RefKodeTermohonFormComponent', () => {
  let component: RefKodeTermohonFormComponent;
  let fixture: ComponentFixture<RefKodeTermohonFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefKodeTermohonFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefKodeTermohonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
