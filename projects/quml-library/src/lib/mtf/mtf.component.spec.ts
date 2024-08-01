import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MtfComponent } from './mtf.component';
import { mtfQuestionMetadata, reorderedOptions } from './mtf.component.spec.data';

describe('MtfComponent', () => {
  let component: MtfComponent;
  let fixture: ComponentFixture<MtfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MtfComponent]
    });
    fixture = TestBed.createComponent(MtfComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should call #initialize', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(component, 'initialize').and.callFake(() => {});
    component.ngOnInit();
    expect(component.initialize).toHaveBeenCalled();
  });

  it('#initialize should call #setLayout', () => {
    spyOn(component, 'initialize').and.callThrough();
    spyOn(component, 'setLayout').and.callFake(() => {});
    component.question = mtfQuestionMetadata;
    component.initialize();
    expect(component.setLayout).toHaveBeenCalled();
    expect(component.interactions).toBeDefined();
    expect(component.questionBody).toBeDefined();
  });

  it('#setLayout should set the layout to vertical', () => {
    component.layout = undefined;
    component.question = {templateId: 'mtf-vertical'};
    spyOn(component, 'setLayout').and.callThrough();
    component.setLayout();
    expect(component.layout).toBe('VERTICAL');
  });

  it('#setLayout should set the layout to horizontal', () => {
    component.layout = undefined;
    component.question = {templateId: 'mtf-horizontal'};
    spyOn(component, 'setLayout').and.callThrough();
    component.setLayout();
    expect(component.layout).toBe('HORIZONTAL');
  });

  it('#setLayout should set the layout to default', () => {
    component.layout = undefined;
    component.question = {templateId: undefined};
    spyOn(component, 'setLayout').and.callThrough();
    component.setLayout();
    expect(component.layout).toBe('DEFAULT');
  });

  it('#handleReorderedOptions should handle #optionsReordered', () => {
    spyOn(component.optionsReordered, 'emit').and.callFake(() => {});
    spyOn(component, 'handleReorderedOptions').and.callThrough();
    component.handleReorderedOptions(reorderedOptions);
    expect(component.optionsReordered.emit).toHaveBeenCalled();
  });
});
