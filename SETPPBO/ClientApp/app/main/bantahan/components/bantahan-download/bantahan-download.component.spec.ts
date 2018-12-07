import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BantahanDownloadComponent } from './bantahan-download.component';

describe('BantahanDownloadComponent', () => {
  let component: BantahanDownloadComponent;
  let fixture: ComponentFixture<BantahanDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BantahanDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BantahanDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
