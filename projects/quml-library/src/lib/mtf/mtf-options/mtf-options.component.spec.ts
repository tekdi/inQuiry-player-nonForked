import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtfOptionsComponent } from './mtf-options.component';
import { mockedOptions, shuffledOptions } from './mtf-options.component.spec.data';

describe('MtfOptionsComponent', () => {
  let component: MtfOptionsComponent;
  let fixture: ComponentFixture<MtfOptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MtfOptionsComponent]
    });
    fixture = TestBed.createComponent(MtfOptionsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should call #shuffleMTFOptions', () => {
    spyOn(component, 'shuffleMTFOptions').and.callFake(() => {});
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.shuffleMTFOptions).toHaveBeenCalled();
  });

  it('#ngOnChanges should call #shuffleMTFOptions', () => {
    component.replayed = true;
    component.tryAgain = true;
    spyOn(component, 'shuffleMTFOptions').and.callFake(() => {});
    spyOn(component, 'ngOnChanges').and.callThrough();
    component.ngOnChanges();
    expect(component.shuffleMTFOptions).toHaveBeenCalled();
  });

  it('#ngOnChanges should not call #shuffleMTFOptions', () => {
    component.replayed = false;
    component.tryAgain = false;
    spyOn(component, 'shuffleMTFOptions').and.callFake(() => {});
    spyOn(component, 'ngOnChanges').and.callThrough();
    component.ngOnChanges();
    expect(component.shuffleMTFOptions).not.toHaveBeenCalled();
  });

  it('#shuffleMTFOptions should shuffle options', () => {
    component.optionsShuffled = false;
    component.options = mockedOptions;
    spyOn(component, 'shuffleMTFOptions').and.callThrough();
    spyOn(component, 'shuffleAndCheck').and.callThrough();
    component.shuffleMTFOptions();
    expect(component.optionsShuffled).toBeTruthy();
  });

  it('#onDrop should emit reorderedOptions', () => {
    spyOn(component, 'onDrop').and.callThrough();
    const event = {
      item: {
        data: {
          "label": "<p>React Js</p>",
          "value": 2
        }
      },
      currentIndex: 2
    };
    component.shuffledOptions = shuffledOptions;
    spyOn(component, 'swapRightOptions').and.callThrough();
    spyOn(component.reorderedOptions, 'emit').and.callFake(() => {});
    component.onDrop(event);
    expect(component.reorderedOptions.emit).toHaveBeenCalled();
  });

  it('#closeModal should close modal', () => {
    component.isModalVisible = true;
    spyOn(component, 'closeModal').and.callThrough();
    component.closeModal();
    expect(component.isModalVisible).toBeFalsy();
  })
});
