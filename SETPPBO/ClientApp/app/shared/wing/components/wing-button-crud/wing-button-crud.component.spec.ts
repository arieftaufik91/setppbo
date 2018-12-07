import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WingButtonCrudComponent } from './wing-button-crud.component';

describe('WingButtonCrudComponent', () => {
  let component: WingButtonCrudComponent;
  let fixture: ComponentFixture<WingButtonCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WingButtonCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WingButtonCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
