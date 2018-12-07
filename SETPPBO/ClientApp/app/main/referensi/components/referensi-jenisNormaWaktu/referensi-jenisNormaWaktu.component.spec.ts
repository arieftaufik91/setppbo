import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefjenisnormawaktuComponent } from './referensi-jenisNormaWaktu.component'

describe('RefjenisnormawaktuComponent', () => {
  let component: RefjenisnormawaktuComponent;
  let fixture: ComponentFixture<RefjenisnormawaktuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefjenisnormawaktuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefjenisnormawaktuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
