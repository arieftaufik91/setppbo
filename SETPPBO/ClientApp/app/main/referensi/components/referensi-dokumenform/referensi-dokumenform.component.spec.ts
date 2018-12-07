import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferensiDokumenformComponent } from './referensi-dokumenform.component';

describe('ReferensiDokumenformComponent', () => {
  let component: ReferensiDokumenformComponent;
  let fixture: ComponentFixture<ReferensiDokumenformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferensiDokumenformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferensiDokumenformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
