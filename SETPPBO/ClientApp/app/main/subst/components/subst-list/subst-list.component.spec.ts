import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstListComponent } from './subst-list.component';

describe('SubstListComponent', () => {
  let component: SubstListComponent;
  let fixture: ComponentFixture<SubstListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

