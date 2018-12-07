import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TandaTerimaSubstFormComponent } from './tanda-terima-subst-form.component';

describe('TandaTerimaSubstFormComponent', () => {
  let component: TandaTerimaSubstFormComponent;
  let fixture: ComponentFixture<TandaTerimaSubstFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TandaTerimaSubstFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TandaTerimaSubstFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
