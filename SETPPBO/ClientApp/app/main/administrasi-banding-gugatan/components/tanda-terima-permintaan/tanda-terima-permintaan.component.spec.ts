import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TandaTerimaPermintaanComponent } from './tanda-terima-permintaan.component';

describe('TandaTerimaPermintaanComponent', () => {
  let component: TandaTerimaPermintaanComponent;
  let fixture: ComponentFixture<TandaTerimaPermintaanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TandaTerimaPermintaanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TandaTerimaPermintaanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
