import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MtfOptions } from '../../interfaces/mtf-interface';
import * as _ from 'lodash-es';

@Component({
  selector: 'quml-mtf-options',
  templateUrl: './mtf-options.component.html',
  styleUrls: ['./mtf-options.component.scss']
})
export class MtfOptionsComponent implements OnInit {
  @Input() options: { left: any[], right: any[] };
  @Output() reorderedOptions = new EventEmitter<MtfOptions>();
  optionsShuffled = false;

  ngOnInit() {
    if (this.options && this.options.right && this.options.left) {
      this.options.right = _.shuffle(this.options.right);
      this.options.left = _.shuffle(this.options.left);
      this.optionsShuffled = true;
    }
  }

  onDrop(event: any) {
    const droppedItem = event.item.data;
    const currentIndex = this.options.right.indexOf(droppedItem);
    const targetIndex = event.currentIndex;
    this.swapRightOptions(currentIndex, targetIndex);
    this.reorderedOptions.emit(this.options);
  }

  private swapRightOptions(index1: number, index2: number) {
    [this.options.right[index1], this.options.right[index2]] = [this.options.right[index2], this.options.right[index1]];
  }
}
