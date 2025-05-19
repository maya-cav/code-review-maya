/**
 * Imports various search result window classes and button event interfaces
 * used to define and configure different search strategies in the POS system.
 */
import { itemsSearchResultWin, inventorySearchResultWin, NewButtonEvent, takbulSearchWin, searchResultWin, managerSearchWin } from './pos-events';

/**
 * Defines the structure of a search strategy, which includes metadata for 
 * how to process and interact with search result windows.
 */
export interface SearchStrategy {
    typeWin: string;
    typeData: string;
    pagenationType: string;

    /** Optional variable name to be passed to the screen logic */
    varName?: string;

    /** Optional dynamic screen identifier */
    dynamicScrean?: number;

    /** Optional action type to perform on result selection */
    typeAction?: string;

    /**
     * Optional initialization logic executed before search begins.
     * @param obj - Object containing metadata or configuration comes from strategies.
     * @param res - the parameters to be init.
     */
    onInit?: (obj: any, res: any) => void;

    /**
     * Extracts the list of field keys to be displayed in the result.
     * @param result - The raw result data.
     * @returns List of field keys.
     */
    getKeys(result: any): string[];

    /**
     * Extracts the display name to be shown in the search result title.
     * @param result - The raw result data.
     * @returns Display name for the search result.
     */
    getSearchName(result: any): string;

    /**
     * Creates an instance of the corresponding search result window class.
     * @param res - Optional initialization data.
     * @returns Instance of a search result window.
     */
    createInstance(res?: any): any;

    /**
     * Optionally generates a configuration for a new button shown in the UI.
     * @param context - Optional context object with screen and button data.
     * @returns Partial button configuration.
     */
    getButtonConfig?(context?: any): Partial<NewButtonEvent>;

    /**
     * Determines whether a given result should be processed or ignored.
     * @param result - The raw result data.
     * @returns True if the result should be processed.
     */
    shouldProcess(result: any): boolean;

    /**
     * Optional action to perform when a user presses Enter on a selected row.
     * @param context - Context object with services, data, and UI references.
     */
    onEnterRowAction?(context: any): void;
}

/**
 * Collection of concrete implementations of `SearchStrategy` for different 
 * types of search windows in the POS system.
 */
export const strategies: SearchStrategy[] = [
    {
        typeWin: "09",
        typeData: "10",
        pagenationType: "10",
        getKeys: () => ["itemCode", "itemName", "discount", "unitPrice"],
        getSearchName: (res) => res.searchString || res.title,
        createInstance: () => new itemsSearchResultWin(),
        getButtonConfig: () => ({
            actCode: 'SEARCH',
            isDisabled: false,
            isVisible: true,
            screenToOpen: 28
        }),
        shouldProcess: (res) => res?.searchString !== '',
        onEnterRowAction: (context) => {
            const itemCode = context.SelectedRowItems;
            if (context.declareService.getCurrentComponent() === 'declaration') {
                context.declareService.declareItem('116', context.authService.sessionId, itemCode, '99', 1, '');
                context.formService.closeModal();
                return;
            }
            context.itemService.itemEntered(itemCode, "", 1, "", 1, context.authService.sessionId);
            context.formService.closeModal();
        }
    },
    {
        typeWin: "96",
        typeData: "97",
        pagenationType: "97",
        getKeys: () => ["inventory", "branchNumber", "branchName"],
        getSearchName: (res) => res.searchString || res.title,
        createInstance: () => new inventorySearchResultWin(),
        shouldProcess: (res) => res?.searchString !== ''
    },
    {
        typeWin: "110",
        typeData: "112",
        pagenationType: "110",
        getKeys: (res) => res.fieldNames?.split('#').filter(Boolean) || [],
        getSearchName: (res) => res.title || res.searchString,
        createInstance: () => new searchResultWin(),
        getButtonConfig: (context) => {
            const newNum = Number(context.screenToOpen.toString().substring(1));
            const buttons = Array.from(context.buttonsService.buttonByNameMap.values()) as NewButtonEvent[];
            return buttons.find(btt => btt.screenToOpen === newNum) || {};
        },
        shouldProcess: (res) => res?.defaultAction !== '',
        onInit: (obj, context) => {
            context.varName = "RET" + obj.returnField;
            context.dynamicScreen = obj.screen;
            context.typeAction = obj.defaultAction;
        },
        onEnterRowAction: (context) => {
            const valCode = context.data[context.selectedIndex][0];
            context.formService.onEnterRowSearch(context.varName, valCode, context.selectedIndex, context.typeAction);
            context.formService.closeModal();
        }
    },
    {
        // Strategy for secretary/director declarations
        typeWin: "99",
        typeData: "100",
        pagenationType: "107",
        getKeys: () => ["code", "description", "sum"],
        getSearchName: (res) => res.searchString || res.title,
        createInstance: () => new takbulSearchWin(),
        shouldProcess: (res) => res?.pagesCount > 0,
        onEnterRowAction: (context) => {
            const code = context.data[context.selectedIndex][0];
            context.declareService.declerationWindowData(101, context.authService.sessionId, code, context.selectedIndex).subscribe({
                next: (response: any[]) => {
                    context.declareService.setCurrentComponent('declaration');
                    context.formService.closeModal();
                }
            });
        }
    },
    {
        // Strategy for certificate 99 declarations
        typeWin: "122",
        typeData: "123",
        pagenationType: "129",
        getKeys: () => ["code", "description", "sumClerck", "sum", "difference"],
        getSearchName: (res) => res.searchString || res.title,
        createInstance: () => new managerSearchWin(),
        shouldProcess: (res) => res?.pagesCount > 0,
        onEnterRowAction: (context) => {
            const code = context.data[context.selectedIndex][0];
            context.declareService.declerationWindowData(124, context.authService.sessionId, code, context.selectedIndex).subscribe({
                next: (response: any[]) => {
                    context.declareService.setCurrentComponent('declaration');
                    context.formService.closeModal();
                }
            });
        }
    }
];
