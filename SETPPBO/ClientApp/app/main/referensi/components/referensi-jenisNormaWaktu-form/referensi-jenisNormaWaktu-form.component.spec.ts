import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefjenisnormawaktuFormComponent } from './referensi-jenisNormaWaktu-form.component';

describe('RefjenisnormawaktuFormComponent', () => {
  let component: RefjenisnormawaktuFormComponent;
  let fixture: ComponentFixture<RefjenisnormawaktuFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefjenisnormawaktuFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefjenisnormawaktuFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
