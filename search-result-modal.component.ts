import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AuthorizationEvent, NewButtonEvent, searchResultData, searchResultWin } from '../pos-events';
import { ButtonsService } from '../buttons.service';
import { FormService } from '../form.service';
import { AuthService } from '../auth.service';
import { strategies } from '../search';
import { ItemService } from '../item.service';
import { environment } from '../../environments/environment';
import { declerationService } from '../decleration.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

declare var bootstrap: any;
declare var window: any; // For Bootstrap's modal functions

@Component({
  selector: 'app-search-result-modal',
  imports: [CommonModule, ConfirmModalComponent],
  templateUrl: './search-result-modal.component.html',
  styleUrl: './search-result-modal.component.css',
})
/**
 * Modal component for displaying search results in the system.
 * Shows a table with results by type, with relevant buttons, pagination, and interactions.
 * Receives data through subscriptions from the buttonsService and formService.
 * All data are manage by the seach strategy.
 */
export class SearchResultModalComponent {
  headers: string[] = [];
  data: string[][] = [];
  rowsPerPage = 1;
  currentPage = 1;
  paginatedData: any[] = [];
  allPages: number = 0;
  Title: string = '';
  searchName: string = '';
  satatButton: string = '';
  errorMessage: string = '';
  buttonToShow: NewButtonEvent[] = [];
  SelectedRowItems: string = '';
  selectedIndex: number = 0;
  typeWin: string = '';
  typeData: string = '';
  pageinationType: string = '';
  keysToExtract: string[] = [];
  newbtt = new NewButtonEvent();
  urlTemplate: string = '';
  screenToOpen: number = 0;
  errorOccured = false;

  @ViewChild(ConfirmModalComponent) confirm!: ConfirmModalComponent;

  constructor(
    private authService: AuthService,
    private buttonsService: ButtonsService,
    private formService: FormService,
    private itemService: ItemService,
    private declareService: declerationService,
  ) { }
  /**
   * Listens for data from the formService and buttonsService.
   * Processes the data based on the type of command received.
   */
  private setFocusOnTableWhenModalOpens(): void {
    const modalEl = document.getElementById('searchResultModal');
    if (!modalEl) return;

    const listener = () => {
      const table = document.getElementById('tableResult');
      table?.focus();
      modalEl.removeEventListener('shown.bs.modal', listener); // הסרה כדי למנוע כפילויות
    };
    modalEl.addEventListener('shown.bs.modal', listener);
  }
  /**
   * Subscribes to data streams from formService and buttonsService.
   * Processes the data to populate the modal with search results.
   * Handles pagination and button configurations.
   * Opens the modal with the search results.
   */
  ngOnInit(): void {
    this.formService.data$.subscribe({
      next: (response) => {
        const commands = response as Array<any>;
        if (!commands?.length) {
          this.errorMessage = 'Empty response';
          return;
        }
        for (const command of commands) {
          /*if need to open window 701*/
          if (command.TYPE === 701) {
            let initiatingEvent = command as AuthorizationEvent;
            this.openadminstratorhModal(initiatingEvent);
            this.formService.closeModal();
            this.declareService.setCurrentComponent('shopping-cart');
            this.buttonsService.setStateCode('2');
            return;
          }
          /*
          * Check if the command type matches any of the strategies defined in the strategies array.
          * If a matching strategy is found, create an instance of it and process the command.
          */
          const strategy = strategies.find(s => s.typeWin == command.TYPE);

          if (!strategy) continue;

          const resultObj = Object.assign(strategy.createInstance(command), command) as searchResultWin;

          if (!strategy.shouldProcess(resultObj)) continue;
          this.paginatedData = []; // Clear paginatedData before populating it again
          this.data = []; // Clear data before populating it again
          this.typeWin = strategy.typeWin; // define the type of window for all modal activity
          this.typeData = strategy.typeData; // define the type of data for all modal activity
          this.pageinationType = strategy.pagenationType;
          this.keysToExtract = strategy.getKeys(resultObj); // get the key for the title of the table
          this.Title = resultObj.constTitle || resultObj.getTitle();
          this.searchName = strategy.getSearchName(resultObj);
          this.screenToOpen = resultObj.screen || 0;

          if (command.TYPE == strategy.typeWin) {
            strategy.onInit?.(resultObj, this); // Call the onInit function if it exists
            //buttons in search modal
            this.satatButton = command.state?.toString() || resultObj.getState();
            this.urlTemplate = resultObj.htmlTemplateName || resultObj.getTitleTemplateName();
            if (!this.urlTemplate) return;
            this.fetchAndDisplayHebrewFromBTags(this.urlTemplate);
          }

          this.handleItems(resultObj, commands);
          this.openModal();

          const btnConfig = strategy.getButtonConfig?.(this);
          if (btnConfig) Object.assign(this.newbtt, btnConfig);
          break;  // תעשה break לאחר שהסטרטגיה הראשונה תבוצע, אם זה מה שאתה רוצה
        }
      }
    });
    /*
    * Subscribe to the searchResultData$ observable from buttonsService.
    * This observable is expected to emit an array of commands.
    * handle the case of button click from search window
    * */
    this.buttonsService.searchResultData$.subscribe({
      next: (response) => {
        let commands = response as Array<any>;
        if (commands === null || commands.length === 0) {
          this.errorMessage = 'Empty response';
          return;
        }
        let searchElemItem = Object.assign(new searchResultWin(), this.findItemByType(commands, this.typeWin));
        this.handleItems(searchElemItem, commands);
      }
    });
    /* this subscribe is for declare window who comes from search window .
    * it's not a part of the search result window
    */
    this.buttonsService.Confirm$.subscribe({
      next: (response) => {
        let commands = response as Array<any>;
        if (commands === null || commands.length === 0) {
          this.errorMessage = 'Empty response';
          return;
        }
        let closeModalAfterPrint = this.findItemByType(commands, '104');
        if (closeModalAfterPrint) {
          this.formService.closeModal();
          this.declareService.setCurrentComponent('shopping-cart');
          this.buttonsService.setStateCode('2');
        }
        let error = this.findItemByType(commands, '11');
        if (error !== null) {
          this.errorOccured = true;
        }
      }
    });
  }
  /** This function handles the items received from the server.
   * It sets the pagination properties and populates the table data based on the type of data received.
   */
  handleItems(elem: any, commands: any[]): void {
    this.rowsPerPage = elem.pageSize;
    this.allPages = elem.pagesCount;
    this.currentPage = elem.pageNumber;

    let items = this.findItemByTypeArr(commands, this.typeData);
    if (items.length == 0) { return; }
    this.populateTableData(commands.filter((item) => item.TYPE == this.typeData));
  }
  /*open the modal and set the focus on the table when it opens*/
  openModal(): void {
    this.setFocusOnTableWhenModalOpens();
    this.buttonToShow = [...this.buttonsService.setButtonsByState(this.satatButton, this.buttonToShow)];
    this.buttonToShow = this.buttonToShow.filter(item => !item.actCode.includes('NEXT') && !item.actCode.includes('PREV'));
    // מציאת מודל פתוח ושמירתו
    const openModal = document.querySelector('.modal.show');
    if (openModal) {
      this.formService.setPreviousModal(bootstrap.Modal.getInstance(openModal));
      this.formService.hidePreviousModal();
    }
    this.selectedIndex = 0;
    new window.bootstrap.Modal(document.getElementById('searchResultModal')).show();
  }
  /** This function populates the table data based on the type of data received.
   * It handles different types of data formats and structures them into a 2D array for display in the table. */
  private populateTableData(arr: any): void {
    if (arr[0]?.valuesString) {
      if (this.urlTemplate == 'SearchSuspension') {
        this.data = arr.map((item: searchResultData) =>
          item.valuesString.split("#")
            .slice(1, 7)
            .map((value, index, array) => {
              switch (index) {
                case 0:
                  return array[5];
                case 1:
                  return array[3];
                case 2:
                  return array[4];
                case 3:
                  return array[1];
                case 4:
                  return array[0];
                case 5:
                  return array[2];
                default:
                  return value;
              }
            })
        );
      }
      else if (this.urlTemplate == 'SearchCustomer' || this.urlTemplate == 'SearchInvoice' || this.urlTemplate == 'SearchKK' || this.urlTemplate == 'SearchOrder') {
        this.data = arr.map((item: searchResultData) =>
          item.valuesString.split("#")
            .slice(1, arr.length - 1));
      }
    } else {
      arr = this.findItemByTypeArr(arr, this.typeData);
      this.data = arr.map((item: any) =>
        this.keysToExtract.map(key => String(item[key as keyof typeof item] ?? ''))
      );
    }
    this.paginatedData = this.data;
    if (this.typeWin === "09") { this.SelectedRowItems = this.getSelectedRowFirstCell(); }

  }
  /**
   * This function extracts the first cell of the selected row from the data array.
   * It returns an empty string if the selected index is out of bounds or if the data is not available.
   */
  private getSelectedRowFirstCell(): string {
    const selectedRow = this.data?.[this.selectedIndex];
    return selectedRow?.[0] ?? '';
  }
  /**
   * This function handles the pagination of the table data.
   * It updates the current page and fetches the next or previous set of data based on the page number.
   */
  setPage(page: number): void {
    if (page === this.currentPage || page < 1 || page > this.allPages) return; // לא לקרוא לשרת אם הדף לא משתנה
    this.currentPage = page;
    this.buttonsService.nextPreviousButton(this.pageinationType, page, this.rowsPerPage, "", this.authService.sessionId, "", this.screenToOpen);
  }

  //function that take strings to headers table from HTML file 
  fetchAndDisplayHebrewFromBTags(urlName: string) {
    fetch(`${environment.templateBaseUrl}${urlName}Header.html`)
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const htmlString = new TextDecoder("windows-1255").decode(buffer);
        const doc = new DOMParser().parseFromString(htmlString, "text/html");

        this.headers = Array.from(doc.querySelectorAll("table td b"))
          .map(el => el.textContent?.trim() || "") // מבטיח שתמיד יהיה string
          .filter(text => text && /^[\u0590-\u05FF\s#"]+$/.test(text));
        if (this.typeWin == "122") {
          this.headers = this.headers.slice(1, this.headers.length);
        } else if (this.urlTemplate == 'SearchKK') {
          this.headers = this.headers.slice(0, this.headers.length - 1);
        }
      })
      .catch(console.error);
  }
  /**
   * This function finds an item in the commands array by its type.
   */
  private findItemByType(commands: any[], type: string): any {
    return commands.find((item) => item.TYPE == type);
  }
  /**
   * This function finds all items in the commands array by their type.
   */
  private findItemByTypeArr(commands: any[], type: string): any[] {
    return commands.filter((item) => item.TYPE == type);
  }
  /**
   * This function handles the activation of buttons in the modal.
   * It checks the button's server code and performs actions accordingly.
   */
  buttonActivated(btt: NewButtonEvent): void {
    switch (btt.javaMethod) {
      case "FormCancel":
        this.formService.closeModal();
        this.formService.buttonActivated(this.newbtt);
        break;
      case "Select":
        this.onEnterRow();
        break;
      default:
        break;
    }
    if (btt.serverCode == "95") {
      this.formService.searchItem(this.SelectedRowItems, this.authService.sessionId, "95", this.selectedIndex);
    } else if (btt.screenToOpen === 24) {
      this.formService.formOpened(this.SelectedRowItems, this.authService.sessionId, 'PLU', btt.screenToOpen, 'SALELIST', this.selectedIndex);
    } else if (btt.serverCode?.toString() === '124') {
      this.declareService.declerationWindowData('124', this.authService.sessionId, this.data[this.selectedIndex][0], this.selectedIndex + 1);
    }
    else {
      this.formService.buttonActivated(btt);
    }
  }
  /**
   * This function handles the action when a row is selected in the table.
   * It checks the strategy for the current type of window and performs actions accordingly.
   */
  onEnterRow(): void {
    const strategy = strategies.find(s => s.typeWin === this.typeWin);
    if (strategy?.onEnterRowAction) {
      strategy.onEnterRowAction?.(this);
    } else {
      this.formService.closeModal();
    }
  }
  /**
   * This function handles the keydown event for keyboard navigation in the table.
   * It allows users to navigate through the rows using the arrow keys.
   */
  onKeydown(event: KeyboardEvent) {
    event.stopPropagation(); // עוצר את האירוע מלהתפשט לחוץ למודל
    event.preventDefault();  // מונע את הפעולה ברמת הדפדפן אם יש

    if (event.key === 'ArrowDown') {
      this.selectedIndex = Math.min(this.selectedIndex + 1, this.paginatedData.length - 1);
    } else if (event.key === 'ArrowUp') {
      this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
    }
    if (this.typeWin === "09") {
      this.SelectedRowItems = this.getSelectedRowFirstCell();
    }
  }
  /**
   * This function handles the selection of a row in the table.
   * It updates the selected index and retrieves the first cell of the selected row.
   */
  selectRow(index: number): void {
    this.selectedIndex = index;
    if (this.typeWin === "09") {
      this.SelectedRowItems = this.getSelectedRowFirstCell();
    }
  }
  /**
   * This function opens the administrator modal for authorization when type is 701.
   */
  openadminstratorhModal(initiatingEvent: AuthorizationEvent): void {
    this.confirm.openModal(initiatingEvent);
  }
}