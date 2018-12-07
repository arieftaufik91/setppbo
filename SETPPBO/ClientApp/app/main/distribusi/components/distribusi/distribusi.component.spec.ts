import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistribusiComponent } from './distribusi.component';

describe('DistribusiDashboardComponent', () => {
  let component: DistribusiComponent;
  let fixture: ComponentFixture<DistribusiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistribusiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistribusiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
