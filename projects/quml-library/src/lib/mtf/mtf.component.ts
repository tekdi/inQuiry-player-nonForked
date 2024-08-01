import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MtfInteractions, MtfOptions } from '../interfaces/mtf-interface';

@Component({
  selector: 'quml-mtf',
  templateUrl: './mtf.component.html',
  styleUrls: ['./mtf.component.scss']
})
export class MtfComponent implements OnInit {
  @Input() question?: any;
  @Input() shuffleOptions: boolean;
  @Input() replayed: boolean;
  @Input() tryAgain?: boolean;
  @Output() optionsReordered = new EventEmitter<MtfOptions>();

  public interactions?: MtfInteractions;
  public questionBody?: string;
  public layout: 'VERTICAL' | 'HORIZONTAL' | 'DEFAULT';

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.setLayout();
    this.interactions = this.question?.interactions;
    this.questionBody = this.question?.body;
  }

  setLayout(): void {
    const templateId = this.question?.templateId;
    if (templateId === 'mtf-vertical') {
      this.layout = 'VERTICAL';
    } else if (templateId === 'mtf-horizontal') {
      this.layout = 'HORIZONTAL';
    } else {
      console.error('Invalid or undefined templateId');
      this.layout = 'DEFAULT';
    }
  }

  handleReorderedOptions(reorderedOptions: MtfOptions) {
    this.optionsReordered.emit(reorderedOptions);
  }
}
