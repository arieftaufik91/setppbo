import { BaseRequestOptions } from '@angular/http';

export class AngularReduxRequestOptions extends BaseRequestOptions {

    public token: string;

    constructor (angularReduxOptions?: any) {

        super();

        if (angularReduxOptions != null) {

            for (let option in angularReduxOptions) {
                let optionValue = angularReduxOptions[option];
            }
        }
    }

    
}