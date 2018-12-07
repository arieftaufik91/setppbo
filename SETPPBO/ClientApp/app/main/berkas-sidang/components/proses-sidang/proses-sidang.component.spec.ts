import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProsesSidangComponent } from './proses-sidang.component';

describe('ProsesSidangComponent', () => {
  let component: ProsesSidangComponent;
  let fixture: ComponentFixture<ProsesSidangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProsesSidangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProsesSidangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
