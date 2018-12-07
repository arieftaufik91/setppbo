import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefKodeTermohonComponent } from './ref-kode-termohon.component';

describe('RefKodeTermohonComponent', () => {
  let component: RefKodeTermohonComponent;
  let fixture: ComponentFixture<RefKodeTermohonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefKodeTermohonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefKodeTermohonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
