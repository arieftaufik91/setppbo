import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import {
    Http,
    RequestOptions,
    RequestOptionsArgs,
    Response,
    Request,
    Headers,
    XHRBackend
} from '@angular/http';
import { LoaderService } from "../../core/layout/components/loader/loader.service";
import { Router } from '@angular/router';


@Injectable()
export class HttpService extends Http {

    constructor(
        backend: XHRBackend,
        defaultOptions: RequestOptions,
        private loaderService: LoaderService,
        private router: Router
    ) {
        super(backend, defaultOptions);
    }


    //request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    //    return super.request(url, options).catch((error: Response) => {
    //        console.log('Request error: ' + error);
    //        if ((error.status === 401 || error.status === 403) && (window.location.href.match(/\?/g) || []).length < 2) {
    //            console.log('The authentication session expires or the user is not authorised. Force refresh of the current page.');
    //            window.location.href = window.location.href + '?' + new Date().getMilliseconds();
    //        }
    //        return Observable.throw(error);
    //    });
    //}

    get(url: string, options?: RequestOptionsArgs): Observable<any> {

        this.showLoader();

        return super.get(url, this.requestOptions(options))
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSuccess(res);
            }, (error: any) => {
                this.onError(error);
            })
            .finally(() => {
                this.onEnd();
            });

    }

    private requestOptions(options?: RequestOptionsArgs): RequestOptionsArgs {

        if (options == null) {
            options = new RequestOptions();
        }

        if (options.headers == null) {
            options.headers = new Headers();
        }

        return options;
    }

    private onCatch(error: any, caught: Observable<any>): Observable<any> {
        console.log('onCatch, error: ' + error);
        if ((error.status === 401) && (window.location.href.match(/\?/g) || []).length < 2) {
            console.log('The authentication session expires or the user is not authorised. Force refresh of the current page.');
            window.location.reload(true);
        }
        else if (error.status === 403) {
            console.log('Forbiden Access');
            this.router.navigate(["/error/401"]);
        }
        return Observable.throw(error);
    }

    private onSuccess(res: Response): void {
    }

    private onError(res: Response): void {
        //console.log('Error, status code: ' + res.status);
    }

    private onEnd(): void {
        this.hideLoader();
    }

    private showLoader(): void {
        this.loaderService.show();
    }

    private hideLoader(): void {
        this.loaderService.hide();
    }
}