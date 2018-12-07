import { Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

export class WingToolbarVariable {
    @Input() state = 'inactive';
    @Input() title = '';
    @Input() back = '';
    @ViewChild('search') focus: ElementRef;

    @Input() custom: any[];

    @Input() add = {visible: true, icon: 'add', tooltip: 'Tambah'};
    @Input() del = {visible: true, icon: 'delete', tooltip: 'Hapus'};
    @Input() edit = {visible: true, icon: 'mode_edit', tooltip: 'Ubah'};
    @Input() view = {visible: true, icon: 'remove_red_eye', tooltip: 'Lihat'};
    @Output() _add: EventEmitter<any> = new EventEmitter();
    @Output() _edit: EventEmitter<any> = new EventEmitter();
    @Output() _del: EventEmitter<any> = new EventEmitter();
    @Output() _view: EventEmitter<any> = new EventEmitter();

    @Input() search = {visible: true, icon: 'search', tooltip: 'Cari'};
    @Input() searchShow = false;
    @Input() byEnter = true;
    @Output() _search: EventEmitter<any> = new EventEmitter();

    @Input() reset = {visible: true, icon: 'update', tooltip: 'Reset'};
    @Output() _reset: EventEmitter<any> = new EventEmitter();


}
