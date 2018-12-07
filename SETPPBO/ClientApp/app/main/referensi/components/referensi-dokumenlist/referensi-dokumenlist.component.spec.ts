import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferensiDokumenlistComponent } from './referensi-dokumenlist.component';

describe('ReferensiDokumenlistComponent', () => {
  let component: ReferensiDokumenlistComponent;
  let fixture: ComponentFixture<ReferensiDokumenlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferensiDokumenlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferensiDokumenlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
