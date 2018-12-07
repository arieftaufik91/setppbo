import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstDetailComponent } from './subst-detail.component';

describe('SubstDetailComponent', () => {
  let component: SubstDetailComponent;
  let fixture: ComponentFixture<SubstDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
