import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BerkasSiapSidangListComponent } from './berkas-siap-sidang-list.component';

describe('BerkasSiapSidangListComponent', () => {
  let component: BerkasSiapSidangListComponent;
  let fixture: ComponentFixture<BerkasSiapSidangListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BerkasSiapSidangListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BerkasSiapSidangListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
