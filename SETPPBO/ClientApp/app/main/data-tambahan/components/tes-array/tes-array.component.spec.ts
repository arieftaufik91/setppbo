import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TesArrayComponent } from './tes-array.component';

describe('TesArrayComponent', () => {
  let component: TesArrayComponent;
  let fixture: ComponentFixture<TesArrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TesArrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TesArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
