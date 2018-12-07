import { NgModule, Component, ElementRef, OnDestroy, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventEmitter, Output } from '@angular/core';
import { IMenuItemModel } from "../../../../shared/models/menu-item";

@Component({
    selector: 'navMenu',
    templateUrl: './nav-menu.component.html',
    animations: [
        trigger('slideInOut', [
            state('false', style({ height: '0px', visibility: 'hidden' })),
            state('true', style({ height: '*', visibility: 'visible' })),
            transition('true <=> false', animate('400ms cubic-bezier(0.4,0.0,0.2,1)')),
        ]),
    ]
})
export class NavMenu {

    @Input() model: IMenuItemModel[];
    @Output() onMenuClick= new EventEmitter();

    handleClick(event: any, item: any) {
        if (item.Disabled) {
            event.preventDefault();
            return;
        }

        item.Expanded = !item.Expanded;

        if (!item.Link) {
            event.preventDefault();
        } else {
            this.onMenuClick.emit();
        }
    }

}

@NgModule({
    imports: [CommonModule, RouterModule],
    exports: [NavMenu, RouterModule],
    declarations: [NavMenu]
})
export class NavMenuModule { }