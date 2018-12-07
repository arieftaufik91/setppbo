import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TesDataComponent } from './tes-data.component';

describe('TesDataComponent', () => {
  let component: TesDataComponent;
  let fixture: ComponentFixture<TesDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TesDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TesDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
