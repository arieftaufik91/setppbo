import { XHRBackend } from '@angular/http';
import { AngularReduxRequestOptions } from '../models/angular-redux-request.options';
import { LoaderService } from '../../core/layout/components/loader/loader.service';
import { HttpService } from "./http.service";
import { Router } from '@angular/router';

function httpServiceFactory(backend: XHRBackend, options: AngularReduxRequestOptions, loaderService: LoaderService, router: Router ) {
    return new HttpService(backend, options, loaderService, router);
}

export { httpServiceFactory };