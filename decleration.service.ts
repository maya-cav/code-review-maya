import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';  // Import environment
import { BehaviorSubject, Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class declerationService {
    private apiUrl = environment.apiUrl || 'http://max:8080/api/mcall?_ROUTINE=JPOS&_NS=INT&_LABEL=JSON';

    private declareData = new BehaviorSubject<any>(null); // Holds the response data
    public data$: Observable<any> = this.declareData.asObservable(); // Observable for components to subscribe to

    private errorCloseSubject = new Subject<void>();
    public errorClose$ = this.errorCloseSubject.asObservable();

    private currentComponentSource = new BehaviorSubject<string>('shopping-cart');
    currentComponent$ = this.currentComponentSource.asObservable();

    constructor(private http: HttpClient) { }
    /*set the component to show in dashboard*/
    setCurrentComponent(component: string): void {
        this.currentComponentSource.next(component);
    }

    getCurrentComponent(): string {
        return this.currentComponentSource.getValue();
    }
    /*declare the kind of payment*/
    declerationWindowData(type: string, sessionId: string, code: string, selectedLine: number): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = JSON.stringify({
            FOCUS: "",
            LNSEL: selectedLine,
            TYPE: type,
            ID: sessionId,
            TKBCOD: code
        });

        this.http.post<any>(this.apiUrl, body, { headers }).subscribe({
            next: (response) => this.declareData.next(response),
            error: (err) => console.error('HTTP Request Failed:', err),
        });
        return this.http.post<any>(this.apiUrl, body, { headers });
    }
    /*when user pay on the declare*/
    paydData(type: string, sessionId: string, code: string, sum: number, quntity: number): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = JSON.stringify({
            SCRTYP: "",
            DECDATA: "",
            SUM: sum,
            ID: sessionId,
            QUN: quntity,
            TYPE: type,
            TKBCOD: code
        });

        this.http.post<any>(this.apiUrl, body, { headers }).subscribe({
            next: (response) => this.declareData.next(response),
            error: (err) => console.error('HTTP Request Failed:', err),
        });
        return this.http.post<any>(this.apiUrl, body, { headers });
    }
    /*when user declare on item in certificate 99*/
    declareItem(type: string, sessionId: string, item: string, jrc: string, quntity: number, certCode: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = JSON.stringify({
            ITEM: item,
            JRC: jrc,
            QUN: quntity,
            ID: sessionId,
            CRTCOD: certCode,
            TYPE: type
        });

        this.http.post<any>(this.apiUrl, body, { headers }).subscribe({
            next: (response) => this.declareData.next(response),
            error: (err) => console.error('HTTP Request Failed:', err),
        });
        return this.http.post<any>(this.apiUrl, body, { headers });
    }
}