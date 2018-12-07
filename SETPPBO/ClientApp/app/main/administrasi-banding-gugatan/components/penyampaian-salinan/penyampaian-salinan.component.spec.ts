import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenyampaianSalinanComponent } from './penyampaian-salinan.component';

describe('PenyampaianSalinanComponent', () => {
  let component: PenyampaianSalinanComponent;
  let fixture: ComponentFixture<PenyampaianSalinanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenyampaianSalinanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenyampaianSalinanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
