import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefConfigFormComponent } from './ref-config-form.component';

describe('RefConfigFormComponent', () => {
  let component: RefConfigFormComponent;
  let fixture: ComponentFixture<RefConfigFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefConfigFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
