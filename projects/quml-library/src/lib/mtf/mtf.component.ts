import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MtfInteractions, MtfOptions } from '../interfaces/mtf-interface';
import { mtfQuestionMetadata } from './mtf.data';

@Component({
  selector: 'quml-mtf',
  templateUrl: './mtf.component.html',
  styleUrls: ['./mtf.component.scss']
})
export class MtfComponent implements OnInit {
  @Input() questionMetadata?: any;
  @Input() shuffleOptions: boolean;
  @Output() optionsReordered = new EventEmitter<MtfOptions>();

  public interactions?: MtfInteractions;
  public questionBody?: string;
  public layout: 'VERTICAL' | 'HORIZONTAL' | 'DEFAULT';

  ngOnInit(): void {
    this.initialize();
  }

  private initialize(): void {
    this.setLayout();
    this.interactions = this.questionMetadata?.interactions;
    this.questionBody = this.questionMetadata?.body;
  }

  private setLayout(): void {
    const templateId = this.questionMetadata?.templateId;
    if (templateId === 'mtf-vertical') {
      this.layout = 'VERTICAL';
    } else if (templateId === 'mtf-horizontal') {
      this.layout = 'HORIZONTAL';
    } else {
      console.error('Invalid or undefined templateId');
      this.layout = 'DEFAULT';
    }
  }

  public handleReorderedOptions(reorderedOptions: MtfOptions) {
    this.optionsReordered.emit(reorderedOptions);
  }
}
