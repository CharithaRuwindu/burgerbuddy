import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmLayout } from './adm-layout';

describe('AdmLayout', () => {
  let component: AdmLayout;
  let fixture: ComponentFixture<AdmLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
