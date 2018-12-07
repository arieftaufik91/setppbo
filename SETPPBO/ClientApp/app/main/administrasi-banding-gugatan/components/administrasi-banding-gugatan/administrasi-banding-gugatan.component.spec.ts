import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrasiBandingGugatanComponent } from './administrasi-banding-gugatan.component';

describe('AdministrasiBandingGugatanComponent', () => {
  let component: AdministrasiBandingGugatanComponent;
  let fixture: ComponentFixture<AdministrasiBandingGugatanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministrasiBandingGugatanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrasiBandingGugatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
