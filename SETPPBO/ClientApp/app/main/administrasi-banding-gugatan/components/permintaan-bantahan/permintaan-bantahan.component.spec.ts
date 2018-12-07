import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermintaanBantahanComponent } from './permintaan-bantahan.component';

describe('PermintaanBantahanComponent', () => {
  let component: PermintaanBantahanComponent;
  let fixture: ComponentFixture<PermintaanBantahanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermintaanBantahanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermintaanBantahanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
