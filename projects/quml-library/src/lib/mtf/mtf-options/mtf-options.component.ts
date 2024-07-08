import { Component, EventEmitter, Input, OnChanges,OnInit, Output } from '@angular/core';
import { MtfOptions } from '../../interfaces/mtf-interface';
import * as _ from 'lodash-es';

@Component({
  selector: 'quml-mtf-options',
  templateUrl: './mtf-options.component.html',
  styleUrls: ['./mtf-options.component.scss'],
})
export class MtfOptionsComponent implements OnInit, OnChanges {
  @Input() options: { left: any[], right: any[] };
  @Input() layout: string;
  @Input() shuffleOptions: boolean;
  @Input() replayed: boolean;
  @Input() tryAgain?: boolean;
  @Output() reorderedOptions = new EventEmitter<MtfOptions>();
  shuffledOptions: { left: any[]; right: any[] };
  optionsShuffled = false;
  isModalVisible: boolean = false;
  selectedImageSrc: string = '';

  constructor() {
    this.shuffledOptions = { left: [], right: [] };
  }

  ngOnInit() {
    this.shuffleMTFOptions();
  }

  ngOnChanges(): void {
    if(this.replayed || this.tryAgain) {
      this.shuffleMTFOptions();
    }
  }

  shuffleMTFOptions() {
    const leftOptions = this.options.left;
    const rightOptions = this.options.right;

    /* Left options will be shuffled if the shuffleOptions configuration is set to true */
    let shuffledLeft = this.shuffleOptions
      ? this.shuffleAndCheck(leftOptions)
      : leftOptions;

    /* Right options will always be shuffled */
    let shuffledRight = this.shuffleAndCheck(rightOptions);

    /* Ensure that the shuffled lists do not contain matching pairs */
    while (
      shuffledLeft.some(
        (item, index) => item.value === shuffledRight[index].value
      )
    ) {
      shuffledRight = this.shuffleAndCheck(rightOptions);
    }

    this.shuffledOptions = {
      left: shuffledLeft,
      right: shuffledRight
    };
    this.optionsShuffled = true;
  }

  shuffleAndCheck(array: any[]): any[] {
    let shuffledArray;
    while (true) {
      shuffledArray = _.shuffle(array);
      if (shuffledArray.every((item, index) => item.value !== index)) {
        break;
      }
    }
    return shuffledArray;
  }

  onDrop(event: any) {
    const droppedItem = event.item.data;
    const currentIndex = this.shuffledOptions.right.indexOf(droppedItem);
    const targetIndex = event.currentIndex;
    this.swapRightOptions(currentIndex, targetIndex);
    this.reorderedOptions.emit(this.shuffledOptions);
  }

  swapRightOptions(index1: number, index2: number) {
    [this.shuffledOptions.right[index1], this.shuffledOptions.right[index2]] = [
      this.shuffledOptions.right[index2],
      this.shuffledOptions.right[index1],
    ];
  }

  openModal(event: any): void {
    const parentDiv = event.target.parentElement;
    const figure = parentDiv.querySelector('figure');
    if (figure) {
      const img = figure.querySelector('img');
      if (img) {
        this.selectedImageSrc = img.src;
        this.isModalVisible = true;
      }
    }
  }

  closeModal(): void {
    this.isModalVisible = false;
  }
}
