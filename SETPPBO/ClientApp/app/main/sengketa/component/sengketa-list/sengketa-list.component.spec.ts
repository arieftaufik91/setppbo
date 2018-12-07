import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SengketaListComponent } from './sengketa-list.component';

describe('SengketaListComponent', () => {
  let component: SengketaListComponent;
  let fixture: ComponentFixture<SengketaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SengketaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SengketaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
