export class POSEvent {
  ID: number = 0;
  TYPE: string = '0';
}

export class ItemEvent extends POSEvent {
  CHGPRC: string = '';
  ISSALE: string = '';
  override TYPE: string = '15';
  dealName: string = '';
  discount: string = '';
  isWeight: string = '';
  itemCode: string = '';
  description: string = '';
  lineNum: number = 0;
  quantity: number = 0;
  returnType: string = '';
  salerCode: number = 0;
  displayOnInput: string = '';
  totalLine: string = '';
  totalBeforeDis: string = '';
  unitPrice: string = '';
  price: string = '';
}

export class ClearListEvent extends POSEvent {
  override TYPE: string = '14'; // TODO - not sure about the type number
  listToClear: number = 1; // 1 - items list; 2 - promotions list
}

export class SaleSummaryEvent extends POSEvent {
  balance: string = '';
  override ID: number = 0;
  items: number = 0;
  lines: number = 1;
  total: string = '';
  override TYPE: string = '16';
}

export class EndSaleEvent extends POSEvent {
  override ID: number = 0;
  override TYPE: string = '63';
  change: string = '';
  clearTheSale: boolean = false;
  lastPaymentSum: string = '';
  numItems: number = 0;
  numLines: number = 0;
  totalPaid: string = '';
  totalSale: string = '';
  totalSaving: string = '';
}

export class POSErrorEvent extends POSEvent {
  errorMessage: string = '';
  errorCode: string = '';
  title: string = '';
  override ID: number = 0;
  override TYPE: string = '11';
}

export class StartNewSessionEvent extends POSEvent {
  GENDIS: string = '';
  override TYPE: string = '1';
  altIP: string = '';
  cashierName: string = '';
  defaultCustName: string = '';
  defaultCustNum: number = 0;
  discountMessage: string = '';
  errorMassage: string = '';
  machineName: string = '';
  machineNumber: number = 0;
  msg: string = '';
  resultCode: number = 0;
  salerCode: number = 0;
  salerName: string = '';
  sessionID: string = '';
  sessionPassword: number = 0;
  storeName: string = '';
  storeNumber: number = 0;
  templatesPath: string = '';
}

export class SalerChangedEvent extends POSEvent {
  override TYPE: string = '128';
  salerName: string = '';
  salerNumber: number = 0;
}

export class CustomerInfoEvent extends POSEvent {
  override TYPE: string = '8';
  custName: string = '';
  custNumber: number = 0;
  discountMessage: string = '';
}

export class FormCreationEvent extends POSEvent {
  override TYPE: string = '803';
  CONFNEED: boolean = false;
  ONEXIT: string = '';
  ONLOAD: string = '';
  SCRENAME: string = '';
  finishState: string = '';
  formCode: string = '';
  formTitle: string = '';
  loadState: string = '';
  showNumPad: boolean = false;
  twofield: number = 1;
}

export class FieldAdditionToFormEvent extends POSEvent {
  override TYPE: string = '804';
  formCode: string = '';
  fieldCode: string = '';
  fieldDesc: string = '';
  fieldType: string = '';
  defaultValue: string = '';
  tableCode: string = '';
  fontSize: string = '';
  foreground: string = '';
  background: string = '';
  maxLength: number = 0;
  readOnly: boolean = false;
  serverValidation: boolean = false;
  isMustField: boolean = false;
  fldnum: number = 1;
  newln: boolean = false;
}

export class UpdateFormEvent extends POSEvent {
  override TYPE: string = '61';
  screenCode: string = '';
  fieldCode: string = '';
  value: string = '';
}

export enum ScreenOpenCode {
  Open = 0,
  Close = 1,
  CloseImmediately = 2,
}

export class OpenFormEvent extends POSEvent {
  override TYPE: string = '60';
  screenCode: string = '';
  openCode: ScreenOpenCode = ScreenOpenCode.Open;
}

export class NewButtonEvent extends POSEvent {
  override TYPE: string = '806';
  actCode: string = '';
  caption: string = '';
  imageName: string = '';
  key: string = '';
  javaMethod: string = '';
  screenToOpen: number = 0;
  serverCode: string = '';
  refTable: string = '';
  isVisible: boolean = false;
  isDisabled: boolean = false;
}

// TODO: add MapButtonToStateEvent (TYPE=809)
export class MapButtonToStateEvent extends POSEvent {
  override TYPE: string = '809';
  stateCode: string = '';
  actionCode: string = '';
  isDisabled: boolean = false;
}

export class ManagerAuthorizationEvent extends POSEvent {
  override TYPE: string = '700';
  mumpsGoto: string = '';
  msgTitle: string = '';
  msgDesc: string = '';
}

export class AuthorizationEvent extends POSEvent {
  override TYPE: string = '701';
  mumpsGoto: string = '';
  msgTitle: string = '';
}

export class commonItemsEvent extends POSEvent {
  override TYPE: string = '207';
  loc: number = 0;
  itemCode: string = '';
  itemName: string = '';
  unitPrice: string = '';
  urlpic: string = '';
  category: string = '';
}

export class PromotionLineEvent extends POSEvent {
  override TYPE: string = '90';
  itemCode: string = '';
  quantity: string = '';
  discount: string = '';
  total: string = '';
  isSale: string = '';
  totalB4Discount: string = '';
  returnType: string = '';
  unitB4Discount: string = '';
  itemName: string = '';
  dealName: string = '';
  unitPrice: string = '';
  urlpic: string = '';
  isWeight: boolean = false;
  shouldDisplay: boolean = false;
  changePrice: boolean = false;
  messageOnly: boolean = false;
  lineNum: number = 0;
}

export class PaymentLineEvent extends POSEvent {
  override TYPE: string = '78';
  payMethod: string = '';
  payAmount: string = '';
  details: string = '';
  balance: string = '';
}
/* the universal event for all the search results */
export class searchResultWin extends POSEvent {
  override TYPE: string = '110';
  constTitle: string = '';
  defaultAction: string = '';
  fieldNames: string = '';
  itemsCount: number = 0;
  pageNumber: number = 0;
  pageSize: number = 0;
  pagesCount: number = 0;
  returnField: string = '';
  screen: number = 0;
  state: string = '';
  title: string = '';
  totalsString: string = '';
  searchString: string = '';
  htmlTemplateName: string = '';
  getTitle(): string {
    return 'חיפוש';
  }
  getState(): string {
    return '601';
  }
  getTitleTemplateName(): string {
    return '';
  }
}
/*the universal event for all the search results data */
export class searchResultData extends POSEvent {
  override TYPE: string = '112';
  screen: number = 0;
  valuesString: string = '';
}


export class takbulSearchWin extends searchResultWin {
  override TYPE: string = '99';
  override state: string = '';
  override title: string = '';

  override getTitle(): string {
    return 'רשימת תקבולים להצהרה';
  }
  override getState(): string {
    if (this.state == null || this.state == '') {
      return '603';
    } else {
      return this.state;
    }
  }
  override getTitleTemplateName(): string {
    return 'SearchTakbul';
  }
}

export class takbulSearchResultData extends searchResultData {
  override TYPE: string = '100';
  defaultAction: string = '';
  code: number = 0;
  sum: string = '';
  description: string = '';
}

export class TakbulLineAddedEvent extends POSEvent {
  override TYPE: string = '102';
  quantity: string = '';
  amount: string = '';
  total: string = '';
}

export class managerSearchWin extends searchResultWin {
  override TYPE: string = '122';

  override getTitle(): string {
    return 'רשימת תקבולים להצהרה';
  }
  override getState(): string {
    return '605';
  }
  override getTitleTemplateName(): string {
    return 'SearchManager';
  }
}

export class managerSearchResultData extends searchResultData {
  override TYPE: string = '123';
  difference: string = '';
  code: number = 0;
  sum: string = '';
  description: string = '';
  sumClerck: number = 0;
}

export class managerLineAddedEvent extends POSEvent {
  override TYPE: string = '102';
  quantity: string = '';
  amount: string = '';
  total: string = '';
}

export class vendorRowEvent extends POSEvent {
  override TYPE: string = '116';
  amount: string = '';
  description: string = '';
  discount: string = '';
  itemCode: string = '';
  orderQuantity: string = '';
  remark: string = '';
  rowNumber: number = 0;
  stock: string = '';
  totalPrice: string = '';
  unitName: string = '';
  unitPrice: string = '';
  vendorPrice: string = '';
}

export class vendorTotalModifiedEvent extends POSEvent {
  override TYPE: string = '117';
  priceSum: string = '';
  quantitySum: string = '';
}


export class itemsSearchResultWin extends searchResultWin {
  //send to server
  override TYPE: string = '09';
  id: number = 0;
  searchType: number = 0;
  override getTitle(): string {
    return 'חיפוש פריט';
  }
  override getState(): string {
    return '600';
  }
  override getTitleTemplateName(): string {
    return 'SearchItem';
  }
}

export class saleItemSearchResultData extends searchResultData {
  //items from server to search results
  override TYPE: string = '10';
  discount: string = '';
  isItemOnSale: boolean = false;
  unitPrice: number = 0;
}

export class inventorySearchResultWin extends searchResultWin {
  //send to server
  override TYPE: string = '96';
  id: number = 0;
  searchType: number = 0;
  totalInventory: string = '';
  totalOrdered: string = '';
  override getTitle(): string {
    return 'שאילתת מצאי לפריט';
  }
  override getTitleTemplateName(): string {
    return 'SearchInventory';
  }
}

export class inventorySearchResultData extends searchResultData {
  //items from server to search results
  override TYPE: string = '97';
  brunchName: string = '';
  brunchNumber: number = 0;
}

export class actionSearchResultWin extends searchResultWin {
  //send to server
  override TYPE: string = '66';
  id: number = 0;
  searchType: number = 0;
  totalInventory: string = '';
  totalOrdered: string = '';
  override getTitle(): string {
    return 'פעולות נוספות';
  }
  override getTitleTemplateName(): string {
    return 'SearchActions';
  }
}

export class actionSearchResultData extends searchResultData {
  override TYPE: string = '67';
  actionCode: string = '';
  description: string = '';
}

export class customerSearchResultWin extends searchResultWin {
  id: number = 0;
  searchType: number = 0;
  totalInventory: string = '';
  totalOrdered: string = '';
  override getTitle(): string {
    return 'חיפוש לקוח';
  }
  override getTitleTemplateName(): string {
    return 'SearchCustomer';
  }
}

export class customerSearchResultData extends searchResultData {
  custNumber: string = '';
  custName: string = '';
  custId: string = '';
  address: string = '';
}

export class historySearchResultData extends searchResultData {
  override TYPE: string = '0';
  custName: string = '';
  item: string = '';
  description: string = '';
  discount: string = '';
  unitPrice: string = '';
  totalSum: string = '';
  quantity: number = 0;
}

export class salerSearchResultData extends searchResultData {
  override TYPE: string = '0';
  salerCode: string = '';
  salerName: string = '';
}

export class suspensionSearchResultWin extends searchResultWin {
  id: number = 0;
  searchType: number = 0;
  totalInventory: string = '';
  totalOrdered: string = '';
  override getTitle(): string {
    return 'רשימת מכירות מושהות';
  }
  override getTitleTemplateName(): string {
    return 'SearchSuspension';
  }
}

export class suspensionSearchResultData extends searchResultData {
  totalSaleSum: string = '';
  lastItem: string = '';
  suspensionDate: string = '';
  suspensionTime: string = '';
  numOfItems: number = 0;
  saleID: number = 0;
}

export class AddValueToTableEvent extends POSEvent {
  override TYPE: string = '802';
  tableCode: string = '';
  key: string = '';
  value: string = '';
  value2: string = '';
  value3: string = '';
  urlpic: string = '';
}

export class RemoveValueFromTable extends POSEvent {
  override TYPE: string = '810';
  tableName: string = '';
  lineNumber: number = 0;
}

export class LastInvoiceNumberEvent extends POSEvent {
  override TYPE: string = '31';
  invoice: string = '';
}