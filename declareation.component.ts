import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ButtonsService } from '../buttons.service';
import { ItemEvent, managerLineAddedEvent, PaymentLineEvent, TakbulLineAddedEvent, vendorRowEvent } from '../pos-events';
import { AdminstratorModalComponent } from '../adminstrator-modal/adminstrator-modal.component';
import { FormService } from '../form.service';
import { Subscription } from 'rxjs';
import { declerationService } from '../decleration.service';

@Component({
  selector: 'app-declareation',
  imports: [CommonModule, FormsModule],
  templateUrl: './declareation.component.html',
  styleUrl: './declareation.component.css'
})
export class DeclareationComponent {
  grandTotal: string = '0.00';
  declarArr: Array<TakbulLineAddedEvent> = [];
  vendorDeclare: Array<vendorRowEvent> = [];
  private subscriptions: Subscription[] = [];
  code: string = '';
  title: string = '';
  errorOccured = false;
  statusEvent: string = '';
  numCert: string = '';
  lastSaleEnded: boolean = false;
  isActive = false;
  selectedIndex: number = 0;
  items: Array<ItemEvent> = [];
  itemSummaryLine: string = '';
  payments: PaymentLineEvent[] = [];
  itemLine: string = '';

  @ViewChild(AdminstratorModalComponent) adminstrator!: AdminstratorModalComponent;

  @ViewChild('inputField', { static: false }) inputField!: ElementRef;
  /*handle focus on input field when component is loaded*/
  ngAfterViewChecked(): void {
    setTimeout(() => {
      this.inputField?.nativeElement.focus();
    });
  }

  constructor(private authService: AuthService,
    private buttonsService: ButtonsService, private formService: FormService,
    private declareService: declerationService) { }

  ngOnInit(): void {
    /*when data coes after action in declare window*/
    this.declareService.data$.subscribe({
      next: (response) => {
        if (!response) {
          return;
        }
        let commands = response as Array<any>;
        for (const command of commands) {
          this.declareData(command);
        }
      }
    });
    /*when data comes after action in dynamic form window*/
    this.formService.data$.subscribe({
      next: (response) => {
        if (!response) {
          return;
        }
        let commands = response as Array<any>;
        for (const command of commands) {
          this.declareData(command);
        }
      }
    });
  }
  /*handle data from declare window*/
  declareData(command: any): void {
    if (command.TYPE == 13) {
      this.declarArr = [];
    }
    if (command.TYPE === 11) {
      this.errorOccured = true;
    }

    if (command.TYPE == 115) {
      this.declareService.setCurrentComponent('declaration');
      this.title = command.certDescription + "" + command.certType;
      this.numCert = command.certCode;
      this.grandTotal = command.confirmedSum;
      this.statusEvent = "116";
    } else if (command.TYPE == 117) {
      this.grandTotal = command.priceSum;
      this.itemSummaryLine = command.quantitySum;
    } else if (command.TYPE == 103) {
      this.code = command.takbulCode;
      this.title = command.title;
      this.grandTotal = command.total;
      this.statusEvent = "102";
      this.buttonsService.setStateCode('100');
    } else if (command.TYPE == 126) {
      this.code = command.takbulCode;
      this.title = command.title;
      this.grandTotal = command.declaredSum;
      this.statusEvent = "125";
      this.buttonsService.setStateCode('102');
    } else if (command.TYPE == 116) {
      this.vendorDeclare.push(command as vendorRowEvent);
    } else if (command.TYPE == 102) {
      this.declarArr.push(command as TakbulLineAddedEvent);
    } else if (command.TYPE == 125) {
      this.declarArr.push(command as managerLineAddedEvent);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  /*declare on pay input*/
  onEnter(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    let bill: number = 0;
    let count: number = 0;
    const parts = value.split('*');
    if (parts.length === 2) {
      count = parseInt(parts[0].trim(), 10);
      bill = parseInt(parts[1].trim(), 10);
    }
    else {
      count = 1;
      bill = value.trim() === '' ? 0 : parseInt(value.trim(), 10);
    }
    this.declareService.paydData(this.statusEvent, this.authService.sessionId, this.code, bill, count);
    (event.target as HTMLInputElement).value = '';
  }
  /*declare on item in certificate 99*/
  onEnterVendor(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    let item: string = '';
    let count: number = 0;
    const parts = value.split('*');
    if (parts.length === 2) {
      count = parseInt(parts[0].trim(), 10);
      item = parts[1];
    }
    else {
      count = 1;
      item = value;
    }
    this.declareService.declareItem(this.statusEvent, this.authService.sessionId, item, '99', count, this.numCert);
    (event.target as HTMLInputElement).value = '';
  }
  /*only use in certificate 99*/
  deleteItem(item: string): void {    //Deleting an item from the shopping list
    this.declareService.declareItem(this.statusEvent, this.authService.sessionId, item, '99', -1, this.numCert);
  }
}
