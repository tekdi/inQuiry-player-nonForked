import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtfComponent } from './mtf.component';

describe('MtfComponent', () => {
  let component: MtfComponent;
  let fixture: ComponentFixture<MtfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MtfComponent]
    });
    fixture = TestBed.createComponent(MtfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
