import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
})
export class CalculatorComponent {
  @Output() valueSelected = new EventEmitter<string>();

  currentValue: string = '';
  /*report to parent component the value that was selected*/
  onButtonClick(value: string) {
    if (value === 'enter') {
      this.valueSelected.emit(value); // שולח את הערך שנלחץ (enter) בלי לשנות את הפוקוס
      return; // לא מבצעים שום פעולה נוספת
    }
    if (value === 'backspace') {
      this.currentValue = this.currentValue.substring(0, this.currentValue.length - 1);
      this.valueSelected.emit(this.currentValue);
    } else {
      this.currentValue += value;
      this.valueSelected.emit(this.currentValue);
    }
  }
}
