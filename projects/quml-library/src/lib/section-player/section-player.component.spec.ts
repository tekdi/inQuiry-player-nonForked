import { CommonModule } from '@angular/common';
import { ElementRef, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ErrorService, PLAYER_CONFIG } from '@project-sunbird/sunbird-player-sdk-v9';
import { CarouselComponent } from 'ngx-bootstrap/carousel';
import { of, Subject } from 'rxjs';
import { fakeMainProgressBar } from '../main-player/main-player.component.spec.data';
import { QumlLibraryService } from '../quml-library.service';
import { ViewerService } from '../services/viewer-service/viewer-service';
import { UtilService } from '../util-service';
import { QuestionCursor } from './../quml-question-cursor.service';
import { SectionPlayerComponent } from './section-player.component';
import { mockSectionMTFQuestions, mockSectionPlayerConfig, rearrangedOptions } from './section-player.component.spec.data';


describe('SectionPlayerComponent', () => {
  let component: SectionPlayerComponent;
  let fixture: ComponentFixture<SectionPlayerComponent>;
  let viewerService, utilService, errorService;
  const { changes, mockParentConfig, mockSectionConfig, mockSectionProgressBar, mockSectionQuestions, mockSectionMultiSelectQuestions } = mockSectionPlayerConfig;
  class ViewerServiceMock {
    initialize() { }
    raiseStartEvent() { }
    raiseHeartBeatEvent() { }
    getQuestions() { }
    updateSectionQuestions() { }
    raiseExceptionLog() { }
    getQuestion() { }
    raiseResponseEvent() { }
    getSectionQuestions() { }
    raiseAssesEvent() { }
    qumlPlayerEvent = new EventEmitter<any>();
    qumlQuestionEvent = new EventEmitter<any>();
    pauseVideo() { }
  }

  class ElementRefMock {
    nativeElement: {
      style: {
        height: string;
        width: string;
      }
    };
  }

  const myCarousel = jasmine.createSpyObj("CarouselComponent", {
    "getCurrentSlideIndex": 1, "selectSlide": {}, "move": {}, isLast: false
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SectionPlayerComponent, CarouselComponent],
      imports: [
        CommonModule
      ],
      providers: [
        QumlLibraryService,
        QuestionCursor,
        { provide: ViewerService, useClass: ViewerServiceMock },
        { provide: ElementRef, useClass: ElementRefMock },
        { provide: PLAYER_CONFIG, useValue: { contentCompatibilityLevel: 6 } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionPlayerComponent);
    component = fixture.componentInstance;
    viewerService = TestBed.inject(ViewerService);
    utilService = TestBed.inject(UtilService);
    errorService = TestBed.inject(ErrorService);
    component.imageModal = TestBed.inject(ElementRef);
    component.questionSlide = TestBed.inject(ElementRef);
    // fixture.detectChanges();
  });

  afterEach(() => {
    spyOn(component, 'ngOnDestroy').and.callFake(() => { });
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to events and set config on every changes', () => {
    spyOn<any>(component, 'subscribeToEvents');
    spyOn<any>(component, 'setConfig');
    component.ngOnChanges(changes);
    expect(component['subscribeToEvents']).toHaveBeenCalled();
    expect(component['setConfig']).toHaveBeenCalled();
  });

  it('ngAfterViewInit should raise event', () => {
    spyOn(component, 'ngAfterViewInit').and.callThrough();
    spyOn(viewerService, 'raiseStartEvent').and.callFake(() => {});
    spyOn(viewerService, 'raiseHeartBeatEvent').and.callFake(() => {});
    component.ngAfterViewInit();
    expect(viewerService.raiseStartEvent).toHaveBeenCalled();
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
  })

  it('should subscribeToEvents', () => {
    let destroy$: Subject<boolean> = new Subject<boolean>();
    component.destroy$ = destroy$;
    component.destroy$.next(true);
    component.sectionConfig = mockSectionConfig;
    viewerService.isAvailableLocally = false;
    spyOn(viewerService, 'raiseExceptionLog').and.callFake(() => {})
    viewerService.qumlPlayerEvent = of({});
    viewerService.qumlQuestionEvent = of({error: 'some error'});
    spyOn(component.playerEvent, 'emit').and.callFake(() => {});
    component['subscribeToEvents']();
    expect(component.playerEvent.emit).toHaveBeenCalled();
    expect(viewerService.raiseExceptionLog).toHaveBeenCalled();
  });

  it('should set all the configuration for the section', fakeAsync(() => {
    const element = document.createElement('div');
    element.setAttribute('id', 'overlay-button');
    component.sectionIndex = 0;
    component.showStartPage = true;
    component.sectionConfig = mockSectionConfig;
    component.parentConfig = mockParentConfig;
    component.myCarousel = myCarousel;
    component.mainProgressBar = fakeMainProgressBar;
    spyOn(viewerService, 'getSectionQuestions').and.returnValue(mockSectionQuestions);
    spyOn(viewerService, 'raiseStartEvent');
    spyOn(viewerService, 'raiseHeartBeatEvent');
    spyOn(component, 'setImageZoom');
    spyOn(component, 'removeAttribute');
    spyOn(viewerService, 'initialize');
    spyOn<any>(component, 'checkCompatibilityLevel');
    spyOn(component, 'sortQuestions');
    spyOn(viewerService, 'updateSectionQuestions');
    spyOn(component, 'resetQuestionState');
    spyOn(document, 'querySelector').and.returnValue(element);
    component['setConfig']();
    tick(200);
    expect(viewerService.raiseStartEvent).toHaveBeenCalled();
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
    expect(component.setImageZoom).toHaveBeenCalled();
    expect(component.removeAttribute).toHaveBeenCalled();
    expect(viewerService.initialize).toHaveBeenCalled();
    expect(component['checkCompatibilityLevel']).toHaveBeenCalled();
    expect(viewerService.getSectionQuestions).toHaveBeenCalled();
    expect(component.sortQuestions).toHaveBeenCalled();
    expect(viewerService.updateSectionQuestions).toHaveBeenCalled();
    expect(component.resetQuestionState).toHaveBeenCalled();
    flush();
  }));

  it('should remove the attribute from the html element', fakeAsync(() => {
    const element = document.createElement('div');
    spyOn(document, 'querySelector').and.returnValue(element);
    spyOn(element, 'removeAttribute');
    component.removeAttribute();
    tick(100);
    expect(element.removeAttribute).toHaveBeenCalled();
  }));

  it('should sort the questions', () => {
    component.questionIds = ["do_21348431559137689613", "do_21348431640099225615"]
    component.questions = mockSectionQuestions;
    component.sortQuestions();
    expect(component.questions[0].identifier).toBe("do_21348431559137689613");
  });

  it('should move to the next slide', () => {
    component.questions = mockSectionQuestions;
    component.myCarousel = myCarousel;
    component.noOfQuestions = 1;
    spyOn(viewerService, 'raiseHeartBeatEvent');
    spyOn(component, 'emitSectionEnd');
    component.nextSlide();
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalledTimes(2);
    expect(component.emitSectionEnd).toHaveBeenCalled();
  });

  it('should calculate the score on click of next button', () => {
    component.questions = mockSectionQuestions;
    component.myCarousel = jasmine.createSpyObj("CarouselComponent", {
      "getCurrentSlideIndex": 1, "move": {}, isLast: true
    });
    component.noOfQuestions = 2;
    component.currentOptionSelected = { option: 'option 1' };
    spyOn(viewerService, 'raiseHeartBeatEvent');
    spyOn(component, 'calculateScore').and.callThrough();
    spyOn(viewerService, 'raiseResponseEvent');
    spyOn(component, 'setImageZoom');
    spyOn(component, 'resetQuestionState');
    spyOn(component, 'clearTimeInterval');
    component.nextSlide();
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalledTimes(2);
    expect(component.calculateScore).toHaveBeenCalled();
    expect(viewerService.raiseResponseEvent).toHaveBeenCalled();
    expect(component.setImageZoom).toHaveBeenCalled();
    expect(component.resetQuestionState).toHaveBeenCalled();
    expect(component.clearTimeInterval).toHaveBeenCalled();
  });

  it('should navigate to previous slide', () => {
    spyOn(viewerService, 'raiseHeartBeatEvent');
    spyOn(component, 'setImageZoom');
    spyOn(component, 'setSkippedClass');
    component.myCarousel = myCarousel;
    component.questions = mockSectionQuestions;
    component.prevSlide();
    expect(component['showAlert']).toBe(false);
    expect(component.setImageZoom).toHaveBeenCalled();
    expect(component.setSkippedClass).toHaveBeenCalled();
  });

  it('should navigate to next slide, not root page', () => {
    component.showRootInstruction = true;
    component.parentConfig = mockParentConfig;
    component.nextSlideClicked({ type: 'next' });
    expect(component.showRootInstruction).toBeFalsy();
  });

  it('should change the slide', () => {
    spyOn(viewerService, 'pauseVideo');
    component.activeSlideChange({});
    expect(component.initialSlideDuration > 0).toBeTruthy();
    expect(viewerService.pauseVideo).toHaveBeenCalled();
  });

  it('should getQuestion', () => {
    component.myCarousel = myCarousel;
    component.threshold = 2;
    component.noOfTimesApiCalled = 1;
    spyOn(viewerService, 'getQuestions');
    component.getQuestion();
    expect(viewerService.getQuestions).toHaveBeenCalled();
  });

  it('should fetch a Question', () => {
    component.myCarousel = myCarousel;
    component.threshold = 1;
    component.noOfTimesApiCalled = 1;
    spyOn(viewerService, 'getQuestion');
    component.getQuestion();
    expect(viewerService.getQuestion).toHaveBeenCalled();
  });

  it('should reset the question stage', () => {
    component.resetQuestionState();
    expect(component.active).toBeFalsy();
    expect(component.showAlert).toBeFalsy();
    expect(component.optionSelectedObj).toBeUndefined();
    expect(component.currentOptionSelected).toBeUndefined();
    expect(component.currentQuestion).toBeUndefined();
    expect(component.currentOptions).toBeUndefined();
    expect(component.currentSolutions).toBeUndefined();
  });

  it('should navigate to root page', () => {
    component.showRootInstruction = true;
    component.parentConfig = mockParentConfig;
    component.parentConfig.isSectionsAvailable = false;
    component.myCarousel = jasmine.createSpyObj("CarouselComponent", {
      "getCurrentSlideIndex": 0, "move": {}
    });
    spyOn(component, 'nextSlide');
    component.nextSlideClicked({ type: 'next' });
    expect(component.nextSlide).toHaveBeenCalled();
  });

  it('should validate the option before moving to the next question', () => {
    spyOn(component, 'validateQuestionInteraction');
    component.parentConfig = mockParentConfig;
    component.parentConfig.isSectionsAvailable = true;
    component.showRootInstruction = false;
    component.myCarousel = myCarousel;
    component.nextSlideClicked({ type: 'next' });
    expect(component.validateQuestionInteraction).toHaveBeenCalled();
  })

  it('should navigate to previous question', () => {
    component.optionSelectedObj = { value: 1 };
    component.showFeedBack = true;
    component.myCarousel = myCarousel;
    spyOn(component, 'validateQuestionInteraction');
    component.previousSlideClicked({ event: 'previous clicked' });
    expect(component.stopAutoNavigation).toBe(false);
    expect(component.validateQuestionInteraction).toHaveBeenCalled();
  });

  it('should navigate to previous section', () => {
    component.currentSlideIndex = 0;
    component.parentConfig = mockParentConfig;
    component.mainProgressBar = fakeMainProgressBar;
    component.myCarousel = myCarousel;
    spyOn(component, 'getCurrentSectionIndex').and.returnValue(1);
    spyOn(component, 'jumpToSection');
    component.previousSlideClicked({ event: 'previous clicked' });
    expect(component.getCurrentSectionIndex).toHaveBeenCalled();
    expect(component.jumpToSection).toHaveBeenCalledWith('do_21348431528472576011');
  });

  it('should navigate to the previous slide', () => {
    component.currentSlideIndex = 1;
    spyOn(component, 'prevSlide');
    component.previousSlideClicked({ event: 'previous clicked' })
    expect(component.prevSlide).toHaveBeenCalled();
  });

  it('should return the current slide index', () => {
    component.sectionConfig = mockSectionConfig;
    component.mainProgressBar = fakeMainProgressBar;
    const index = component.getCurrentSectionIndex();
    expect(index).toBe(0);
  });

  it('should jump to slide clicked, to instruction page', () => {
    component.progressBarClass = [];
    spyOn(component, 'goToSlide');
    component.goToSlideClicked({}, 0);
    expect(component.jumpSlideIndex).toBe(0);
    expect(component.goToSlide).toHaveBeenCalled();
  });

  it('should jump to slide clicked with feedback ON', () => {
    const event = {
      keyCode: 13,
      stopPropagation: () => { },
    }
    component.progressBarClass = fakeMainProgressBar;
    component.optionSelectedObj = { value: 1 };
    component.showFeedBack = true;
    spyOn(component, 'validateQuestionInteraction');
    component.goToSlideClicked(event, 2);
    expect(component.jumpSlideIndex).toBe(2);
    expect(component.stopAutoNavigation).toBe(false);
    expect(component.validateQuestionInteraction).toHaveBeenCalled();
  });

  it('should jump to slide clicked with feedback OFF', () => {
    const event = {
      keyCode: 13,
      stopPropagation: () => { },
    }
    component.progressBarClass = fakeMainProgressBar;
    component.optionSelectedObj = { value: 1 };
    component.showFeedBack = false;
    spyOn(component, 'goToSlide');
    component.goToSlideClicked(event, 2);
    expect(component.jumpSlideIndex).toBe(2);
    expect(component.stopAutoNavigation).toBe(true);
    expect(component.goToSlide).toHaveBeenCalledWith(2);
  });

  it('should keypress Enter', () => {
    const event = {
      keyCode: 13,
      stopPropagation: () => { },
    }
    component.progressBarClass = fakeMainProgressBar;
    spyOn(event, 'stopPropagation');
    spyOn(component, 'goToSlideClicked');
    component.onEnter(event, 2);
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.goToSlideClicked).toHaveBeenCalled();
  });

  it('should jump to the section on enter', () => {
    const event = {
      keyCode: 13,
      stopPropagation: () => { },
    }
    spyOn<any>(event, 'stopPropagation');
    spyOn(component, 'validateQuestionInteraction');
    component.myCarousel = myCarousel;
    component.sectionConfig = mockSectionConfig;
    component.optionSelectedObj = { value: 1 };
    component.onSectionEnter(event, 'do_1234343');
    expect(event['stopPropagation']).toHaveBeenCalled();
    expect(component.validateQuestionInteraction).toHaveBeenCalledWith('jump');
  });

  it('should emit the scoreboard event', () => {
    component.sectionConfig = mockSectionConfig;
    component.questions = mockSectionQuestions;
    spyOn(viewerService, 'updateSectionQuestions');
    spyOn(component.showScoreBoard, 'emit');
    component.onScoreBoardClicked();
    expect(viewerService.updateSectionQuestions).toHaveBeenCalled();
    expect(component.showScoreBoard.emit).toHaveBeenCalled();
  });

  it('should open scoreboard on press of enter key', () => {
    const ev = new KeyboardEvent('keypress', { key: 'Enter' });
    spyOn(ev, 'stopPropagation');
    spyOn(component, 'onScoreBoardClicked');
    component.onScoreBoardEnter(ev);
    expect(ev.stopPropagation).toHaveBeenCalled();
    expect(component.onScoreBoardClicked).toHaveBeenCalled();
  })

  it('should focus on next tab', fakeAsync(() => {
    const ele = document.createElement('div');
    spyOn(document, 'querySelector').and.returnValue(ele);
    spyOn(ele, 'focus');
    component.focusOnNextButton();
    tick(100);
    expect(ele.focus).toHaveBeenCalled();
  }));

  it('should return null if currectly selected option and previously selected option are same when cardinality is single', () => {
    spyOn(component, 'focusOnNextButton');
    component.currentOptionSelected = { value: 1, cardinality: "single" };
    component.myCarousel = myCarousel;
    component.getOptionSelected({ value: 1, cardinality: "single" });
    expect(component.focusOnNextButton).not.toHaveBeenCalled();
  });

  it('should mark the question as skipped if not selected the option', () => {
    component.currentOptionSelected = { value: 1 };
    component.myCarousel = myCarousel;
    component.questions = mockSectionQuestions;
    component.parentConfig = mockParentConfig;
    component.showFeedBack = false;
    spyOn(component, 'focusOnNextButton');
    spyOn(viewerService, 'raiseHeartBeatEvent');
    spyOn(component, 'validateQuestionInteraction');
    component.getOptionSelected({ value: 2 });
    expect(component.focusOnNextButton).toHaveBeenCalled();
    expect(component.active).toBe(true);
    expect(component.currentOptionSelected).toEqual({ value: 2 });
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalledWith('OPTION_CLICKED', 'interact', 1);
    expect(component.validateQuestionInteraction).toHaveBeenCalledWith();
  });

  it('should mark it as selected option', () => {
    component.currentOptionSelected = { option: { value: 1 } };
    component.myCarousel = myCarousel;
    component.questions = mockSectionQuestions;
    component.parentConfig = mockParentConfig;
    component.showFeedBack = false;
    spyOn(component, 'focusOnNextButton');
    spyOn(viewerService, 'raiseHeartBeatEvent');
    spyOn(component, 'validateQuestionInteraction');
    component.getOptionSelected({ option: { value: 2 }, solutions: [{ type: 'video', value: 'do_113143853080248320171' }] });
    expect(component.focusOnNextButton).toHaveBeenCalled();
    expect(component.active).toBe(true);
    // expect(component.currentOptionSelected).toEqual({ option: { value: 2 } });
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalledWith('OPTION_CLICKED', 'interact', 1);
    expect(component.validateQuestionInteraction).toHaveBeenCalled()
  });

  it('should mark it as selected option and solution as empty if not exists', () => {
    component.currentOptionSelected = { option: { value: 1 } };
    component.myCarousel = myCarousel;
    component.questions = mockSectionQuestions;
    component.parentConfig = mockParentConfig;
    component.showFeedBack = false;
    spyOn(component, 'focusOnNextButton');
    spyOn(viewerService, 'raiseHeartBeatEvent');
    spyOn(component, 'validateQuestionInteraction');
    component.getOptionSelected({ option: { value: 2 } });
    expect(component.focusOnNextButton).toHaveBeenCalled();
    expect(component.active).toBe(true);
    expect(component.currentSolutions).toBe(undefined);
    // expect(component.currentOptionSelected).toEqual({ option: { value: 2 } });
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalledWith('OPTION_CLICKED', 'interact', 1);
    expect(component.validateQuestionInteraction).toHaveBeenCalled()
  });

  it('#handleMTFOptionsChange() should update scoreboard with skipped', () => {
    component.mtfReorderedOptionsMap = undefined;
    component.myCarousel = myCarousel;
    component.questions = mockSectionQuestions;
    component.parentConfig = mockParentConfig;
    component.showFeedBack = false;
    spyOn(component, 'focusOnNextButton').and.callFake(() => {});
    spyOn(viewerService, 'raiseHeartBeatEvent').and.callFake(() => {});
    spyOn(component, 'validateQuestionInteraction').and.callFake(() => {});
    spyOn(component, 'updateScoreBoard').and.callFake(() => {})
    component.handleMTFOptionsChange(undefined);
    expect(component.focusOnNextButton).toHaveBeenCalled();
    expect(component.active).toBe(true);
    expect(component.currentSolutions).toBe(undefined);
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
    expect(component.validateQuestionInteraction).toHaveBeenCalled()
  });

  it('#handleMTFOptionsChange() should update scoreboard', () => {
    component.mtfReorderedOptionsMap = undefined;
    component.myCarousel = myCarousel;
    component.questions = mockSectionMTFQuestions;
    component.showFeedBack = false;
    spyOn(component, 'focusOnNextButton').and.callFake(() => {});
    spyOn(viewerService, 'raiseHeartBeatEvent').and.callFake(() => {});
    spyOn(component, 'validateQuestionInteraction').and.callFake(() => {});
    spyOn(component, 'updateScoreBoard').and.callFake(() => {})
    component.handleMTFOptionsChange(rearrangedOptions);
    expect(component.focusOnNextButton).toHaveBeenCalled();
    expect(component.active).toBe(true);
    expect(component.currentSolutions).toBeDefined();
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
    expect(component.validateQuestionInteraction).toHaveBeenCalled()
  });

  it('should handle the duration end', () => {
    spyOn(component, 'emitSectionEnd');
    spyOn(viewerService, 'pauseVideo');
    component.durationEnds();
    expect(component.showSolution).toBe(false);
    expect(component.showAlert).toBe(false);
    expect(component.emitSectionEnd).toHaveBeenCalledWith(true);
    expect(viewerService.pauseVideo).toHaveBeenCalled();
  });

  it('should check compatibility of the questionset', () => {
    spyOn(component, 'checkContentCompatibility').and.callThrough();
    spyOn(viewerService, 'raiseExceptionLog').and.callFake(() => {});
    component['checkCompatibilityLevel'](7);
    expect(component.checkContentCompatibility).toHaveBeenCalled();
    expect(viewerService.raiseExceptionLog).toHaveBeenCalled();
  });

  it('should emit the event on end of section', () => {
    component.myCarousel = myCarousel;
    component.sectionConfig = mockSectionConfig;
    spyOn(component, 'createSummaryObj');
    spyOn(component, 'calculateScore').and.callThrough();
    spyOn(utilService, 'getTimeSpentText');
    spyOn(viewerService, 'updateSectionQuestions');
    spyOn(component.sectionEnd, 'emit');
    component.emitSectionEnd(false, 'do_sectionId')
    expect(component.createSummaryObj).toHaveBeenCalled();
    expect(component.calculateScore).toHaveBeenCalled();
    expect(utilService.getTimeSpentText).toHaveBeenCalled();
    expect(viewerService.updateSectionQuestions).toHaveBeenCalled();
    expect(component.sectionEnd.emit).toHaveBeenCalled();
  });

  it('should close the alert when clicked on close button', () => {
    spyOn(viewerService, 'raiseHeartBeatEvent');
    component.myCarousel = myCarousel;
    component.closeAlertBox({ type: 'close' });
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
    expect(component.showAlert).toBe(false);
  });

  it('should close the alert when clicked on tryAgain button', () => {
    spyOn(viewerService, 'raiseHeartBeatEvent');
    component.myCarousel = myCarousel;
    component.closeAlertBox({ type: 'tryAgain' });
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
    expect(component.showAlert).toBe(false);
  });

  it('should add skipped class', () => {
    component.progressBarClass = fakeMainProgressBar;
    component.setSkippedClass(0);
    expect(component.progressBarClass[0].class).toBe('skipped');
  });

  it('validateQuestionInteraction should call handleInteraction', () => {
    spyOn(component, 'handleInteraction').and.callFake(() => {});
    component.myCarousel = myCarousel;
    component.questions = mockSectionQuestions;
    component.sectionConfig = mockSectionConfig;
    component.parentConfig = mockParentConfig;
    spyOn(utilService, 'getKeyValue').and.returnValue('response1');
    spyOn(utilService, 'getEDataItem').and.callThrough();
    spyOn(component, 'isSkipAllowed').and.callThrough();
    spyOn(component, 'validateQuestionInteraction').and.callThrough();
    component.validateQuestionInteraction();
    expect(component.handleInteraction).toHaveBeenCalled();
  });

  it('validateQuestionInteraction should call handleNoInteraction', () => {
    spyOn(component, 'handleNoInteraction').and.callFake(() => {});
    component.myCarousel = myCarousel;
    component.questions = mockSectionQuestions;
    component.sectionConfig = mockSectionConfig;
    spyOn(utilService, 'getKeyValue').and.returnValue('response1');
    spyOn(utilService, 'getEDataItem').and.returnValue({});
    spyOn(component, 'isSkipAllowed').and.returnValue(true);
    spyOn(component, 'validateQuestionInteraction').and.callThrough();
    component.validateQuestionInteraction('next');
    expect(component.handleNoInteraction).toHaveBeenCalled();
  });

  it('isSkipAllowed should return true for SA', () => {
    spyOn(component, 'isSkipAllowed').and.callThrough();
    expect(component.isSkipAllowed('SA')).toBeTruthy();
  });

  it('isSkipAllowed should return true for MCQ', () => {
    component.optionSelectedObj = undefined;
    component.allowSkip = true;
    spyOn(component, 'isSkipAllowed').and.callThrough();
    expect(component.isSkipAllowed('MCQ')).toBeTruthy();
  });

  it('isSkipAllowed should return true for MTF', () => {
    component.mtfReorderedOptionsMap = undefined;
    component.allowSkip = true;
    spyOn(component, 'isSkipAllowed').and.callThrough();
    expect(component.isSkipAllowed('MTF')).toBeTruthy();
  });

  it('handleInteraction() should call handleMCQInteraction for MCQ', () => {
    component.optionSelectedObj = {
      "name": "optionSelect",
      "option": {
          "value": 1,
      },
      "cardinality": "single"
    }
    const selectedQuestion = mockSectionPlayerConfig.mockSectionQuestions[0];
    const responseKey = 'response1';
    const edataItem = {};
    const currentIndex = 0;
    const type = 'next';
    spyOn(component, 'handleMCQInteraction').and.callFake(() => {});
    spyOn(component, 'handleInteraction').and.callThrough();
    component.handleInteraction(selectedQuestion, responseKey, edataItem, currentIndex, type);
    expect(component.handleMCQInteraction).toHaveBeenCalled();
  });

  it('handleInteraction() should call handleMCQInteraction for MMCQ', () => {
    component.optionSelectedObj = {
      "name": "optionSelect",
      "option": {
          "value": 1,
      },
      "cardinality": "multiple"
    }
    const selectedQuestion = mockSectionPlayerConfig.mockSectionMultiSelectQuestions[0];
    const responseKey = 'response1';
    const edataItem = {};
    const currentIndex = 0;
    const type = 'next';
    spyOn(component, 'handleMCQInteraction').and.callFake(() => {});
    spyOn(component, 'handleInteraction').and.callThrough();
    component.handleInteraction(selectedQuestion, responseKey, edataItem, currentIndex, type);
    expect(component.handleMCQInteraction).toHaveBeenCalled();
  });

  it('handleInteraction() should call handleMTFInteraction for MTF', () => {
    component.mtfReorderedOptionsMap = rearrangedOptions;
    const selectedQuestion = mockSectionMTFQuestions[0];
    const responseKey = 'response1';
    const edataItem = {};
    const currentIndex = 0;
    const type = 'next';
    spyOn(component, 'handleMTFInteraction').and.callFake(() => {});
    spyOn(component, 'handleInteraction').and.callThrough();
    component.handleInteraction(selectedQuestion, responseKey, edataItem, currentIndex, type);
    expect(component.handleMTFInteraction).toHaveBeenCalled();
  });

  it('handleMCQInteraction() should call getMultiselectScore for MMCQ', () => {
    component.optionSelectedObj = {
      "name": "optionSelect",
      "option": {
          "value": 1,
      },
      "cardinality": "multiple"
    }
    const selectedQuestion = mockSectionPlayerConfig.mockSectionMultiSelectQuestions[0];
    const edataItem = {};
    const currentIndex = 0;
    const isMultipleChoice = true;
    const type = 'next'
    spyOn(utilService, 'getMultiselectScore').and.returnValue(1);
    spyOn(component, 'handleCorrectAnswer').and.callFake(() => {});
    spyOn(component, 'handleMCQInteraction').and.callThrough();
    component.handleMCQInteraction(selectedQuestion, edataItem, currentIndex, isMultipleChoice, type);
    expect(utilService.getMultiselectScore).toHaveBeenCalled();
  });

  it('handleMCQInteraction() should call getSingleSelectScore for MCQ', () => {
    component.optionSelectedObj = {
      "name": "optionSelect",
      "option": {
          "value": 1,
      },
      "cardinality": "single"
    }
    const selectedQuestion = mockSectionPlayerConfig.mockSectionQuestions[0];
    const edataItem = {};
    const currentIndex = 0;
    const isMultipleChoice = false;
    const type = 'next'
    spyOn(utilService, 'getSingleSelectScore').and.returnValue(1);
    spyOn(component, 'handleCorrectAnswer').and.callFake(() => {});
    spyOn(component, 'handleMCQInteraction').and.callThrough();
    component.handleMCQInteraction(selectedQuestion, edataItem, currentIndex, isMultipleChoice, type);
    expect(utilService.getSingleSelectScore).toHaveBeenCalled();
  });

  it('handleMTFInteraction() should call getMTFScore for MTF', () => {
    component.isShuffleQuestions = false;
    component.mtfReorderedOptionsMap = rearrangedOptions;
    const selectedQuestion = mockSectionMTFQuestions[0];
    const edataItem = {};
    const currentIndex = 0;
    const isMultipleChoice = false;
    const type = 'next'
    spyOn(utilService, 'getMTFScore').and.returnValue(1);
    spyOn(component, 'handleCorrectAnswer').and.callFake(() => {});
    spyOn(component, 'handleMTFInteraction').and.callThrough();
    component.handleMTFInteraction(selectedQuestion, edataItem, currentIndex, type);
    expect(utilService.getMTFScore).toHaveBeenCalled();
  });

  it('handleMTFInteraction() should call getMTFScore for MTF with score 0', () => {
    component.isShuffleQuestions = false;
    component.mtfReorderedOptionsMap = rearrangedOptions;
    const selectedQuestion = mockSectionMTFQuestions[0];
    const edataItem = {};
    const currentIndex = 0;
    const isMultipleChoice = false;
    const type = 'next'
    spyOn(component, 'handleWrongAnswer').and.callFake(() => {});
    spyOn(utilService, 'getMTFScore').and.returnValue(0);
    spyOn(component, 'handleMTFInteraction').and.callThrough();
    component.handleMTFInteraction(selectedQuestion, edataItem, currentIndex, type);
    expect(utilService.getMTFScore).toHaveBeenCalled();
  });

  it('handleCorrectAnswer() should call correctFeedBackTimeOut', () => {
    component.alertType = undefined;
    component.showFeedBack = true;
    component.isAssessEventRaised = false;
    spyOn(component, 'updateScoreBoard').and.callFake(() => {});
    spyOn(component, 'correctFeedBackTimeOut').and.callFake(() => {});
    spyOn(viewerService, 'raiseAssesEvent').and.callFake(() => {});
    spyOn(component, 'handleCorrectAnswer').and.callThrough();
    component.handleCorrectAnswer(1, {}, 0, {}, 'next');
    expect(component.correctFeedBackTimeOut).toHaveBeenCalled();
  });

  it('handleWrongAnswer() should call updateScoreBoard', () => {
    component.progressBarClass = mockSectionProgressBar.children;
    component.alertType = undefined;
    component.showFeedBack = true;
    component.isAssessEventRaised = false;
    spyOn(component, 'updateScoreBoard').and.callFake(() => {});
    spyOn(component, 'correctFeedBackTimeOut').and.callFake(() => {});
    spyOn(viewerService, 'raiseAssesEvent').and.callFake(() => {});
    spyOn(component, 'handleWrongAnswer').and.callThrough();
    component.handleWrongAnswer(0, {}, 0, {}, 'next');
    expect(component.updateScoreBoard).toHaveBeenCalled();
  });

  it('handleNoInteraction() should call nextSlide()', () => {
    component.isAssessEventRaised = false;
    component.myCarousel = jasmine.createSpyObj("CarouselComponent", {
      "getCurrentSlideIndex": 0, "move": {}, isLast: false
    });
    component.active = true;
    component.startPageInstruction = 'test';
    spyOn(component, 'nextSlide').and.callFake(() => {});
    spyOn(viewerService, 'raiseAssesEvent').and.callFake(() => {});
    spyOn(component, 'handleNoInteraction').and.callThrough();
    component.handleNoInteraction(true, {}, 0 , 'next');
  });

  it('handleNoInteraction() should call infoPopupTimeOut()', () => {
    // component.progressBarClass = mockSectionProgressBar.children;
    component.isAssessEventRaised = true;
    component.myCarousel = jasmine.createSpyObj("CarouselComponent", {
      "getCurrentSlideIndex": 1, "move": {}, isLast: false
    });
    component.active = false;
    component.startPageInstruction = '';
    component.optionSelectedObj = undefined;
    component.active = false;
    component.allowSkip = false;
    component.startPageInstruction = 'test';
    spyOn(utilService, 'canGo').and.returnValue(true);
    spyOn(component, 'infoPopupTimeOut').and.callFake(() => {});
    spyOn(component, 'shouldShowInfoPopup').and.returnValue(true);
    spyOn(viewerService, 'raiseAssesEvent').and.callFake(() => {});
    spyOn(component, 'handleNoInteraction').and.callThrough();
    component.handleNoInteraction(false, {}, 0 , 'next');
  });

  it('#shouldShowInfoPopup() should return true', () => {
    component.progressBarClass = mockSectionProgressBar.children;
    spyOn(utilService, 'getQuestionType').and.returnValue('MCQ');
    component.myCarousel = jasmine.createSpyObj("CarouselComponent", {
      "getCurrentSlideIndex": 1, "move": {}, isLast: false
    });
    component.active = false;
    component.allowSkip = false;
    spyOn(utilService, 'canGo').and.returnValue(true);
    component.startPageInstruction = undefined;
    spyOn(component, 'shouldShowInfoPopup').and.callThrough();
    const result = component.shouldShowInfoPopup(0);
    expect(result).toBeTruthy();
  });

  it('should hide the popup once the time is over', fakeAsync(() => {
    component.infoPopupTimeOut();
    tick(2000);
    expect(component.infoPopup).toBe(false);
  }));


  it('should jump to next question on correct feedback popup times out- direction next', fakeAsync(() => {
    component.myCarousel = jasmine.createSpyObj("CarouselComponent", {
      "getCurrentSlideIndex": 1, "move": {}, isLast: false
    });
    spyOn(component, 'nextSlide');
    component.showAlert = true;
    component.correctFeedBackTimeOut('next');
    tick(4000);
    expect(component.showAlert).toBe(false);
    expect(component.nextSlide).toHaveBeenCalled();
  }));

  it('should jump to next question on correct feedback popup timesout- direction previous', fakeAsync(() => {
    component.myCarousel = jasmine.createSpyObj("CarouselComponent", {
      "getCurrentSlideIndex": 1, "move": {}, isLast: false
    });
    spyOn(component, 'prevSlide');
    component.showAlert = true;
    component.correctFeedBackTimeOut('previous');
    tick(4000);
    expect(component.showAlert).toBe(false);
    expect(component.prevSlide).toHaveBeenCalled();
  }));

  it('should jump to next question on correct feedback popup timesout - direction jump', fakeAsync(() => {
    component.stopAutoNavigation = false;
    component.myCarousel = jasmine.createSpyObj("CarouselComponent", {
      "getCurrentSlideIndex": 1, "move": {}, isLast: false
    });
    spyOn(component, 'goToSlide');
    component.showAlert = true;
    component.correctFeedBackTimeOut('jump');
    tick(4000);
    expect(component.showAlert).toBe(false);
    expect(component.goToSlide).toHaveBeenCalled();
  }));

  it('should jump to next question on correct feedback popup timesout', fakeAsync(() => {
    component.stopAutoNavigation = true;
    component.myCarousel = jasmine.createSpyObj("CarouselComponent", {
      "getCurrentSlideIndex": 1, "move": {}, isLast: true
    });
    spyOn(component, 'emitSectionEnd');
    component.showAlert = true;
    component.correctFeedBackTimeOut('');
    tick(4000);
    expect(component.showAlert).toBe(false);
    expect(component.endPageReached).toBe(true);
    expect(component.emitSectionEnd).toHaveBeenCalled();
  }));

  it('should navigate to the instruction page', () => {
    spyOn(viewerService, 'raiseHeartBeatEvent');
    component.myCarousel = myCarousel;
    component.sectionIndex = 0;
    component.showStartPage = true;
    component.sectionConfig = mockSectionConfig;
    component.goToSlide(0);
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
    expect(component.disableNext).toBe(false);
    expect(component.currentSlideIndex).toBe(0);
    expect(component.showRootInstruction).toBe(true);
  });

  it('should navigate to the page', () => {
    component.myCarousel = myCarousel;
    component.sectionIndex = 1;
    component.showStartPage = true;
    component.sectionConfig = mockSectionConfig;
    spyOn(viewerService, 'raiseHeartBeatEvent');
    spyOn(component, 'setImageZoom');
    spyOn(component, 'highlightQuestion');
    component.goToSlide(1);
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
    expect(component.disableNext).toBe(false);
    expect(component.currentSlideIndex).toBe(1);
    expect(component.setImageZoom).toHaveBeenCalled();
    expect(component.highlightQuestion).toHaveBeenCalled();
  });

  it('should navigate to the next question', () => {
    component.active = true;
    component.myCarousel = myCarousel;
    spyOn(viewerService, 'getQuestions');
    spyOn(component, 'highlightQuestion');
    component.goToQuestion({ questionNo: 2 });
    expect(viewerService.getQuestions).toHaveBeenCalled();
    expect(component.highlightQuestion).toHaveBeenCalled();
  });

  it('should hight light the question on click of question', () => {
    component.questions = mockSectionQuestions;
    component.currentSlideIndex = 1;
    const dummyElement = document.createElement('div');
    const mcq = document.createElement('div');
    mcq.setAttribute('class', 'mcq-title');
    dummyElement.appendChild(mcq);
    spyOn(document, 'getElementById').and.returnValue(dummyElement);
    component.highlightQuestion();
    expect(document.getElementById).toHaveBeenCalled()
  });

  it('should fetch the solution', () => {
    component.showAlert = true;
    component.myCarousel = myCarousel
    component.questions = mockSectionQuestions;
    component.currentSolutions = {};
    spyOn(viewerService, 'raiseHeartBeatEvent');
    spyOn(component, 'clearTimeInterval');
    component.getSolutions();
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalledTimes(2);
    expect(component.clearTimeInterval).toHaveBeenCalled();
  });

  it('should show solution page if solution is available', () => {
    component.showSolution = false;
    component.myCarousel = myCarousel;
    spyOn(viewerService, 'raiseHeartBeatEvent');
    spyOn(window, 'clearTimeout');
    component.viewSolution();
    expect(component.showSolution).toBeTruthy();
    expect(component.showAlert).toBeFalsy();
    expect(window.clearTimeout).toHaveBeenCalled();
  });

  it('should close the solution Modal', () => {
    component.showSolution = true;
    spyOn(component, 'setImageZoom');
    spyOn(viewerService, 'raiseHeartBeatEvent');
    spyOn(component, 'focusOnNextButton');
    component.myCarousel = myCarousel;
    component.closeSolution();
    expect(component.setImageZoom).toHaveBeenCalled();
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
    expect(component.focusOnNextButton).toHaveBeenCalled();
    expect(component.showSolution).toBeFalsy();
  });

  it('should show hint', () => {
    spyOn(viewerService, 'raiseHeartBeatEvent');
    component.myCarousel = myCarousel;
    component.viewHint();
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
  });

  it('should show the solution page on click of answer button', () => {
    const enterKeyEvent = new KeyboardEvent('keypress', {
      cancelable: true,
      key: 'Enter',
    });
    spyOn(enterKeyEvent, 'stopPropagation');
    spyOn(component, 'getSolutions');
    component.onAnswerKeyDown(enterKeyEvent);
    expect(component.getSolutions).toHaveBeenCalled();
    expect(enterKeyEvent.stopPropagation).toHaveBeenCalled();
  });


  it('should highlight the selected answer', () => {
    component.progressBarClass = mockSectionProgressBar.children;
    component.myCarousel = myCarousel;
    component.questions = mockSectionQuestions;
    component.sectionConfig = mockSectionConfig;
    spyOn(component, 'focusOnNextButton');
    spyOn(viewerService, 'updateSectionQuestions');
    spyOn(viewerService, 'raiseHeartBeatEvent')
    component.showAnswerClicked({ showAnswer: true }, mockSectionQuestions[0]);
    expect(component.focusOnNextButton).toHaveBeenCalled();
    expect(viewerService.updateSectionQuestions).toHaveBeenCalled();
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalledTimes(2);
  });

  it('should return a score for a question', () => {
    component.questions = mockSectionQuestions;
    const questionData = mockSectionQuestions[0];
    const response = utilService.getSingleSelectScore({value: 0}, questionData.responseDeclaration , true, questionData.outcomeDeclaration);
    expect(response).toEqual(1);
  });

  it('should return a score for a question - wrong answer', () => {
    component.questions = mockSectionQuestions;
    const questionData = mockSectionQuestions[0];
    component.progressBarClass = mockSectionProgressBar.children;
    const response = utilService.getSingleSelectScore(1, questionData.responseDeclaration , true, questionData.outcomeDeclaration);
    expect(response).toEqual(0);
  });

  it('should calculate the score', () => {
    spyOn(component, 'calculateScore').and.callThrough();
    component.progressBarClass = mockSectionProgressBar.children;
    const score = component.calculateScore();
    expect(score).toBe(2);
  });

  it('should call updateScoreBoard', () => {
    component.progressBarClass = mockSectionProgressBar.children;
    component.showFeedBack = false;
    component.updateScoreBoard(0, 'correct', 'This is correct ans', 1);
    component.progressBarClass[0].class = 'correct';
    component.progressBarClass[0].score = 1;
    component.progressBarClass[0].value = 'This is correct ans';
  })

  it('should call setImageZoom', () => {
    component.myCarousel = myCarousel;
    component.setImageZoom();
  });

  it('should zoom in the image', () => {
    component.imageZoomCount = 10;
    component.myCarousel = myCarousel;
    spyOn(viewerService, 'raiseHeartBeatEvent');
    spyOn(component, 'setImageModalHeightWidth');
    component.zoomIn();
    expect(component.imageZoomCount).toEqual(20);
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
    expect(component.setImageModalHeightWidth).toHaveBeenCalled();
  });

  it('should zoom out the image', () => {
    component.imageZoomCount = 110;
    component.myCarousel = myCarousel;
    spyOn(viewerService, 'raiseHeartBeatEvent');
    spyOn(component, 'setImageModalHeightWidth');
    component.zoomOut();
    expect(component.myCarousel.getCurrentSlideIndex).toHaveBeenCalled();
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
    expect(component.imageZoomCount).toEqual(100);
    expect(component.setImageModalHeightWidth).toHaveBeenCalled();
  });

  xit('should set height and width to the modal', () => {
    component.imageZoomCount = 20;
    component.imageModal = new ElementRef({ nativeElement: jasmine.createSpyObj('nativeElement', ['style', 'height', 'width']) });
    component.setImageModalHeightWidth();
    expect(component.imageModal.nativeElement.style.height).toBe('20%');
    expect(component.imageModal.nativeElement.style.width).toBe('20%');
  });

  it('should close the zoom popup', () => {
    spyOn(viewerService, 'raiseHeartBeatEvent');
    component.myCarousel = myCarousel;
    component.closeZoom();
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
    expect(component.showZoomModal).toBe(false);
    expect(component.myCarousel.getCurrentSlideIndex).toHaveBeenCalled();
  });

  it('should clear the time interval', () => {
    component.intervalRef = setTimeout(() => { }, 0);
    spyOn(window, 'clearTimeout');
    component.clearTimeInterval();
    expect(clearTimeout).toHaveBeenCalled();
  });

  it('should clean up the state before leaving the page', () => {
    const errorService = TestBed.inject(ErrorService);
    spyOn(component['destroy$'], 'next');
    spyOn(errorService.getInternetConnectivityError, 'unsubscribe');
    component.ngOnDestroy();
    expect(component['destroy$'].next).toHaveBeenCalledWith(true);
    expect(errorService.getInternetConnectivityError.unsubscribe).toHaveBeenCalled();
  });

  it('should change the height and width of the image modal', () => {
    component.imageModal = new ElementRef({ nativeElement: jasmine.createSpyObj('nativeElement', ['style', 'height', 'width']) });
    component.imageModal.nativeElement.style = {
      height: '100%',
      width: '100%'
    }
    component.imageZoomCount = 20;
    component.setImageModalHeightWidth();
    expect(component.imageModal.nativeElement.style.height).toBe('20%');
    expect(component.imageModal.nativeElement.style.width).toBe('20%');
  });


  it('should call toggleScreenRotate', () => {
    spyOn(viewerService, 'raiseHeartBeatEvent');
    component.myCarousel = myCarousel;
    component.toggleScreenRotate();
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalledWith('DEVICE_ROTATION_CLICKED', 'interact', 2);
  });

  it('should reset the height and width of the image for portrait mode', () => {
    const element = document.createElement('div');
    element.dataset.assetVariable = 'true';
    Object.defineProperty(element, 'clientHeight', { configurable: true, value: 100 });
    spyOn(document, 'querySelectorAll').and.returnValue([element] as any);
    component.setImageHeightWidthClass();
    expect(document.querySelectorAll).toHaveBeenCalled();
    expect(element.classList.contains('portrait'))
  });

  it('should reset the height and width of the image for landscape mode', () => {
    const element = document.createElement('div');
    element.dataset.assetVariable = 'true';
    Object.defineProperty(element, 'clientWidth', { configurable: true, value: 100 });
    spyOn(document, 'querySelectorAll').and.returnValue([element] as any);
    component.setImageHeightWidthClass();
    expect(document.querySelectorAll).toHaveBeenCalled();
    expect(element.classList.contains('landscape'))
  });

  it('should reset the height and width of the image for neutral mode', () => {
    const element = document.createElement('div');
    element.dataset.assetVariable = 'true';
    spyOn(document, 'querySelectorAll').and.returnValue([element] as any);
    component.setImageHeightWidthClass();
    expect(document.querySelectorAll).toHaveBeenCalled();
    expect(element.classList.contains('neutral'))
  });
});
