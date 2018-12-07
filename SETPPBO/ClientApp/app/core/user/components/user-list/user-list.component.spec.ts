/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { UserListComponent } from './user-list.component';

let component: UserListComponent;
let fixture: ComponentFixture<UserListComponent>;

describe('user-list component', () =>
{
    beforeEach(async(() =>
    {
        TestBed.configureTestingModule({
            declarations: [UserListComponent],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(UserListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() =>
    {
        expect(true).toEqual(true);
    }));
});