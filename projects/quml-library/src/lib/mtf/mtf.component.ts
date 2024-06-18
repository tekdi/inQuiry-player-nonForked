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
  @Output() optionsReordered = new EventEmitter<MtfOptions>();

  public interactions?: MtfInteractions;
  public questionBody?: string;

  ngOnInit(): void {
    this.questionMetadata = mtfQuestionMetadata; // remove the line during integration testing when the actual question data comes from list API call
    this.interactions = this.questionMetadata?.interactions;
    this.questionBody = this.questionMetadata?.body;
    console.log('MTF interactions', this.interactions);
    console.log('MTF questionBody', this.questionBody);
  }

  handleReorderedOptions(newOptions: MtfOptions) {
    // Handle the new options
    console.log('MTF Reordered Options:', newOptions);
    this.optionsReordered.emit(newOptions);
  }
}
