import {Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {HotKeyDescription} from '../../../shared/hot-keys/hot-keys.types';
import {HotKeysService} from '../../../shared/hot-keys/hot-keys/hot-keys.service';
import {ReactiveAutoCloseService} from '../../../shared/reactive-tools/reactive-auto-close.service';
import {
    ReactiveToolConfig,
    ReactiveToolDisabled,
    ReactiveToolHotKey,
    ReactiveToolVisible
} from '../../../shared/reactive-tools/reactive-tool';
import {DEBUG_SIDE_BAR_TOKEN} from '../debug-side-bar.token';

@Injectable()
export class DebugPanelService extends ReactiveAutoCloseService implements ReactiveToolDisabled, ReactiveToolVisible, ReactiveToolHotKey {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '0300:9999'
    };

    public readonly hotKey: HotKeyDescription = {
        code: 'ALT+D',
        message: 'Displays the debug panel',
        hidden: environment.production
    };

    public constructor(store: Store, hotKeys: HotKeysService) {
        super(store, hotKeys, DEBUG_SIDE_BAR_TOKEN);
    }

    public disabled(): Observable<boolean> {
        return of(environment.production);
    }

    public icon(): Observable<string> {
        return of('bug');
    }

    public title(): Observable<string> {
        return of('Debug');
    }

    public visible(): Observable<boolean> {
        return of(!environment.production);
    }
}
