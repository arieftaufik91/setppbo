import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GugatanListComponent } from './gugatan-list.component';

describe('GugatanListComponent', () => {
  let component: GugatanListComponent;
  let fixture: ComponentFixture<GugatanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GugatanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GugatanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
