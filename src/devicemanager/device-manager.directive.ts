import {
    Directive,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { DeviceManager }     from '../models/index';

import { DeviceManagerService } from './device-manager.service';
import { deviceManagerServiceProvider } from './device-manager-service-provider';

@Directive({
    selector: '[arDeviceManager]',
    exportAs: 'arDeviceManager',
    providers: [ deviceManagerServiceProvider() ]
})
export class DeviceManagerDirective implements OnDestroy, OnChanges {

    @Input('arDeviceManager') deviceManagerId: string;

    /**
     * "Banana Syntax" [()] for accessing the model externally.
     */
    @Input('arModel') model: DeviceManager;
    @Output('arModelChange') modelChange: EventEmitter<DeviceManager>;

    private subscription: Subscription = null;

    constructor(public service: DeviceManagerService) {
        this.modelChange = new EventEmitter<DeviceManager>();
        this.subscription = this.service.model$.subscribe(it => {
            this.model = it;
            this.modelChange.emit(this.model);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('deviceManagerId') && this.deviceManagerId) {
            this.service.uniqueId = this.deviceManagerId;
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}