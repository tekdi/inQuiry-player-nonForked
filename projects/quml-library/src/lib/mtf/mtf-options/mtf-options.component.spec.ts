import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtfOptionsComponent } from './mtf-options.component';

describe('MtfOptionsComponent', () => {
  let component: MtfOptionsComponent;
  let fixture: ComponentFixture<MtfOptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MtfOptionsComponent]
    });
    fixture = TestBed.createComponent(MtfOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
