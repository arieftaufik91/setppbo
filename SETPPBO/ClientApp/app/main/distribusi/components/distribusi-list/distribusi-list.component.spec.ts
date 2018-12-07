import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistribusiListComponent } from './distribusi-list.component';

describe('DistribusiListComponent', () => {
  let component: DistribusiListComponent;
  let fixture: ComponentFixture<DistribusiListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistribusiListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistribusiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
