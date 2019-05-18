import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Navigate} from '@ngxs/router-plugin';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {filter, map, startWith} from 'rxjs/operators';
import {LogService} from '../../../shared/dev-tools/log/log.service';
import {HotKeyDescription, HotKeySectionEnum} from '../../../shared/hot-keys/hot-keys.types';
import {ReactiveTool, ReactiveToolConfig, ReactiveToolStyle} from '../../../shared/reactive-tools/reactive-tool';
import {ReactiveToolContext} from '../../../shared/reactive-tools/reactive-tool-context';

@Injectable()
export class GeneralTemplatesService implements ReactiveTool, ReactiveToolStyle {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '0100:0100'
    };

    public readonly hotKey: HotKeyDescription = {
        code: 'CTRL+A',
        message: 'Opens the document templates',
        section: HotKeySectionEnum.GENERAL
    };

    private readonly _log: LogService;

    public constructor(private _store: Store,
                       private _router: Router,
                       log: LogService) {
        this._log = log.withPrefix(GeneralTemplatesService.name);
    }

    public color(): Observable<'success' | 'warning' | 'danger' | 'info' | void> {
        return undefined;
    }

    public highlight(): Observable<boolean> {
        return this._router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map((event: NavigationEnd) => event.url),
            startWith(this._router.url),
            map(url => url === '/templates')
        );
    }

    public icon(): Observable<string> {
        return of('file-alt');
    }

    public title(): Observable<string> {
        return of('Create Document');
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger(context?: ReactiveToolContext) {
        this._store.dispatch(new Navigate(['/templates']));
    }
}
