import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistribusiRekapComponent } from './distribusi-rekap.component';

describe('DistribusiRekapComponent', () => {
  let component: DistribusiRekapComponent;
  let fixture: ComponentFixture<DistribusiRekapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistribusiRekapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistribusiRekapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
