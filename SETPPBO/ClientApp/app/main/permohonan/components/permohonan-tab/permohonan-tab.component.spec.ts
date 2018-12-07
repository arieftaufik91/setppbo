import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermohonanTabComponent } from './permohonan-tab.component';

describe('PermohonanTabComponent', () => {
  let component: PermohonanTabComponent;
  let fixture: ComponentFixture<PermohonanTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermohonanTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermohonanTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
