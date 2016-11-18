import { Http }       from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';

export abstract class BaseService<T> {
    // Returns whether or not the service is in the middle of updating the model.
    public get isUpdating(): boolean { return this._updating; }

    // Unique ID of the server-side instance for this service
    protected _uniqueId: string;

    // Base REST URL of this service instance
    protected _baseUrl: string;

    // The internal model managed by this service
    protected _model: Subject<T>;

    // Flag for whether or not this service is setup
    protected _configured: boolean = false;

    // Internal updating flag
    protected _updating: boolean = false;

    constructor(protected http: Http) {
        this._model = <Subject<T>> new Subject();
    }

    set uniqueId(id: string) {
        this.reconfigure(id);
    }

    get uniqueId(): string {
        return this._uniqueId;
    }

    get baseUrl(): string {
        return this._baseUrl;
    }

    get model$(): Observable<T> {
        if (!this._configured) {
            console.error('UniqueId Not set!');
        }
        return this._model.asObservable();
    }

    /**
     * Pass the observable to this method to update your local model
     * NOTE: Setting the uniqueID of this service triggers this update.
     *
     * @param {Observable<T>} obj An optional model to make the "next" model
     *        subscribers will see.
     */
    public update(obj?: Observable<T>) {
        this._updating = true;
        let inst: Observable<T> = obj || this.uniqueQuery$();
        inst.subscribe(o => {
            this.modelUpdated(o);
            this._updating = false;
        });
    }

    // Get an instance of the _model and configure any automated maintenance of
    // that instance.  Also setup _baseUrl to this instance.
    protected abstract uniqueQuery$(): Observable<T>;

    // Update _baseUrl
    protected abstract setBaseUrl(url: string): void;

    protected handleError(error: any): Observable<any> {
        let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    /**
     * @member
     * Call this method from a function that needs a slight delay (for the server)
     * before calling update.
     */
    protected delayedUpdate(msec?: number) {
        setTimeout(() => { this.update(); }, msec || 1000);
    }

    /**
     * @member
     * This method is called when the uniqueId is set and begins the update cycle
     * which includes reconfiguring the base URL and retrieving a fresh copy
     * of the model for any subscribers to $model.
     */
    protected reconfigure(id: string) {
        this._uniqueId = id;
        this.setBaseUrl(id);
        this.update();
        this._configured = true;
    }

    /**
     * @member
     * This method is called during update() calls and pushes the model to any
     * subscribers of $model.  Subclasses can overload this method to either
     * call it before or after internal changes are made related to the model.
     */
    protected modelUpdated(model: T) {
        this._model.next(model);
    }
}
