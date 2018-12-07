import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionRoleListComponent } from './action-role-list.component';

describe('ActionRoleListComponent', () => {
  let component: ActionRoleListComponent;
  let fixture: ComponentFixture<ActionRoleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionRoleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionRoleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
