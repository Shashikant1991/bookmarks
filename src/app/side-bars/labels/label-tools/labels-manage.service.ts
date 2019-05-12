import {Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {HotKeyDescription, HotKeySectionEnum} from '../../../shared/hot-keys/hot-keys.types';
import {HotKeysService} from '../../../shared/hot-keys/hot-keys/hot-keys.service';
import {ReactiveAutoCloseService} from '../../../shared/reactive-tools/reactive-auto-close.service';
import {ReactiveToolConfig, ReactiveToolHotKey} from '../../../shared/reactive-tools/reactive-tool';
import {LABELS_SIDE_BAR_TOKEN} from '../labels-side-bar.token';

@Injectable()
export class LabelsManageService extends ReactiveAutoCloseService implements ReactiveToolHotKey {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '0100:0100'
    };

    public readonly hotKey: HotKeyDescription = {
        code: 'CTRL+L',
        message: 'Opens the labels manager',
        section: HotKeySectionEnum.GENERAL
    };

    public constructor(store: Store, hotKeys: HotKeysService) {
        super(store, hotKeys, LABELS_SIDE_BAR_TOKEN);
    }

    public icon(): Observable<string> {
        return of('tag');
    }

    public title(): Observable<string> {
        return of('Labels');
    }
}
