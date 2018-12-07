import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferensiMajelisformComponent } from './referensi-majelisform.component';

describe('ReferensiMajelisformComponent', () => {
  let component: ReferensiMajelisformComponent;
  let fixture: ComponentFixture<ReferensiMajelisformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferensiMajelisformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferensiMajelisformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
