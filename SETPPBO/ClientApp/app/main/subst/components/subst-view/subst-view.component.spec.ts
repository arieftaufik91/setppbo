import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstViewComponent } from './subst-view.component';

describe('SubstViewComponent', () => {
  let component: SubstViewComponent;
  let fixture: ComponentFixture<SubstViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
