import { Component, OnInit, Input, ElementRef, ViewChild, HostListener, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { User } from '../../../user/models/user';
import { UserService } from "../../../user/services/user.service";
import { RoleService } from '../../../role/services/role.service';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'layout-main',
    templateUrl: './layout-main.component.html',
    styleUrls: ['./layout-main.component.css'],
    providers: [UserService, RoleService]
})
export class LayoutMainComponent implements OnInit {

    userInfo: User = JSON.parse(this.elementRef.nativeElement.getAttribute('claims'));
    sidenavFolded = false;
    sidenavOpened = false;
    subscriptionMedia: Subscription;
    isMobileView: boolean;

    @Input()
    testInput = 'default value';

    @ViewChild('sidenav') sidenav: MatSidenav;

    constructor(
        private elementRef: ElementRef,
        private authService: AuthService,
        private userService: UserService,
        private roleService: RoleService,
        public media: ObservableMedia
    ) { }

    ngOnInit() {
        // set user info to auth service
        this.authService.setUser(this.userInfo);

        // set all roles
        this.roleService.getAll().subscribe(result => { this.authService.allRoles = result; });

        //responsive sidenav using FlexLayoutModule
        this.isMobileView = (this.media.isActive('xs') || this.media.isActive('sm'));

        this.subscriptionMedia = this.media.subscribe((change: MediaChange) => {
            this.isMobileView = (change.mqAlias === 'xs' || change.mqAlias === 'sm');
        });
    }

    handleSidenav() {
        if (this.isMobileView) {
            this.sidenavOpened = false;
        } else {
            this.sidenavFolded = !this.sidenavFolded;
        }
    }

    /*The onLinkClick() handler needs to added to each of the menu links in your template.
    It will close the menu after clicking a link, but not when the menu should stay open*/
    onLinkClick(): void {
        if (this.isMobileView) {
            this.sidenavOpened = false;
        }
    }
}

@Component({
    selector: 'layout-content',
    templateUrl: './layout-content.component.html',
    animations: [
        trigger('slideInOut', [
            state('false', style({ height: '0px', visibility: 'hidden' })),
            state('true', style({ height: '*', visibility: 'visible' })),
            transition('true <=> false', animate('400ms cubic-bezier(0.4,0.0,0.2,1)')),
        ])
    ]
})
export class LayoutContentComponent implements OnInit {
    open = false;
    gsearch: string = "";
    ngOnInit() {
    }
}

@Component({
    selector: 'layout-search-bar',
    template: `
            <div class="global-search" fxFlex>
            <mat-form-field fxFlexFill>
            <button matPrefix mat-icon-button>
            <mat-icon>search</mat-icon>
            </button>
            <input matInput shouldPlaceholderFloat= "false" placeholder='Global Search...'[(ngModel)] = "gsearch" (keyup)='onSearch($event)' />
            <button *ngIf="gsearch" matSuffix mat-icon-button aria-label="Clear"(click)="gsearch=''">
            <i class="material-icons">close </i>
            </button>
            </mat-form-field>
            </div>`
})
export class LayoutSearchBarComponent {
    gsearch: string = "";
    @Output() search: EventEmitter<any> = new EventEmitter();
    onSearch(event:any) {
        this.search.emit(event);
    }

}

interface UserInfo {
    Nama: string;
    Nip: string;
    Gravatar: string;
    Roles: string;
}
