import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaftarSengketaComponent } from './daftar-sengketa.component';

describe('DaftarSengketaComponent', () => {
  let component: DaftarSengketaComponent;
  let fixture: ComponentFixture<DaftarSengketaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaftarSengketaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaftarSengketaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
