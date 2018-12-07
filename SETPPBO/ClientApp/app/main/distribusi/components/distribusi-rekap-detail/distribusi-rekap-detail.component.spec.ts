import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistribusiRekapDetailComponent } from './distribusi-rekap-detail.component';

describe('DistribusiRekapDetailComponent', () => {
  let component: DistribusiRekapDetailComponent;
  let fixture: ComponentFixture<DistribusiRekapDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistribusiRekapDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistribusiRekapDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
