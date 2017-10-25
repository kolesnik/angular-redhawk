import {
    Directive,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    Optional,
    SkipSelf
} from '@angular/core';
import { Http }       from '@angular/http';
import { Subscription } from 'rxjs/Subscription';

import { Redhawk }                from '../models/index';
import { RestPythonService }      from '../rest-python/rest-python.module';
import { RedhawkListenerService } from '../sockets/sockets.module';

import { RedhawkService } from './redhawk.service';

export function serviceSelect(
    service: RedhawkService,
    http: Http,
    restPython: RestPythonService,
    rhls: RedhawkListenerService): RedhawkService {
    if (service === null) {
        service = new RedhawkService(http, restPython, rhls);
    }
    return service;
}

/**
 * The REDHAWK Directive is the entry point, top-level directive for dependency
 * injection when accessing the REST services for a REDHAWK Domain.
 */
@Directive({
    selector: '[arRedhawk]',
    exportAs: 'arRedhawk',
    providers: [
        RedhawkListenerService,
        {
            provide: RedhawkService,
            useFactory: serviceSelect,
            deps: [
                [RedhawkService, new Optional(), new SkipSelf()],
                Http,
                RestPythonService,
                RedhawkListenerService
            ]
        }
    ]
})
export class RedhawkDirective implements OnInit, OnDestroy {
    @Input() serviceName: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally.
     */
    @Input('arModel') model: Redhawk;
    @Output('arModelChange') modelChange: EventEmitter<Redhawk>;

    private subscription: Subscription;

    constructor(public service: RedhawkService) {
        this.modelChange = new EventEmitter<Redhawk>();
        this.model = new Redhawk();
    }

    ngOnInit() {
        this.service.uniqueId = this.serviceName || 'UI Kit';
        this.subscription = this.service.model$.subscribe(it => {
            this.model = it;
            this.modelChange.emit(this.model);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
