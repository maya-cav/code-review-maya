import { Component } from '@angular/core';
import { DateTimePipe } from '../date-time.pipe';

@Component({
  selector: 'app-date-panel',
  imports: [DateTimePipe],
  templateUrl: './date-panel.component.html',
  styleUrl: './date-panel.component.css',
})
export class DatePanelComponent {
  currentDate: string = '';
  intervalId: any;

  ngOnInit() {
    this.updateDate();
    this.intervalId = setInterval(() => this.updateDate(), 1000);
  }

  updateDate() {
    this.currentDate = new Date().toLocaleString();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
