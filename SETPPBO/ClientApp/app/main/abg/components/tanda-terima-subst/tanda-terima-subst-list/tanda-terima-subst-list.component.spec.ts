import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TandaTerimaSubstListComponent } from './tanda-terima-subst-list.component';

describe('TandaTerimaSubstListComponent', () => {
  let component: TandaTerimaSubstListComponent;
  let fixture: ComponentFixture<TandaTerimaSubstListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TandaTerimaSubstListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TandaTerimaSubstListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
