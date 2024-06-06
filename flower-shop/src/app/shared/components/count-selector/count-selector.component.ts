import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'count-selector',
  templateUrl: './count-selector.component.html',
  styleUrls: ['./count-selector.component.scss']
})
export class CountSelectorComponent implements OnInit {
  @Input() count: number | undefined = 1;

  @Output() onCountChange: EventEmitter<number> = new EventEmitter<number>;

  constructor() { }

  ngOnInit(): void {
  }

  countChange() {
    if (this.count !== undefined) {
      this.onCountChange.emit(this.count);
    }
  }

  increaseCount() {
    if (this.count !== undefined) {
      this.count++;
      this.countChange();
    }
  }

  decreaseCount() {
    if (this.count !== undefined && this.count > 1) {
      this.count--;
      this.countChange();
    }
  }

}
