import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionRoleFormComponent } from './action-role-form.component';

describe('ActionRoleFormComponent', () => {
  let component: ActionRoleFormComponent;
  let fixture: ComponentFixture<ActionRoleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionRoleFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionRoleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
