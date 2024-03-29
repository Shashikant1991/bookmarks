import {Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {DocumentsPatchAction} from '../../../states/storage/documents/documents-patch.action';
import {ReactiveTool, ReactiveToolConfig} from '../../reactive-tools/reactive-tool';
import {ReactiveToolContext} from '../../reactive-tools/reactive-tool-context';
import {DocumentContext} from './document-context.service';
import {SideBarsTokenToggleAction} from '../../../states/side-bars/side-bars-token-toggle.action';
import {ARCHIVED_SIDE_BAR_TOKEN} from '../../../side-bars/archived/archived-side-bar.token';

@Injectable()
export class DocumentArchiveService implements ReactiveTool {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '0300:0100'
    };

    public constructor(private _store: Store,
                       private _context: DocumentContext) {

    }

    public icon(): Observable<string> {
        return of('archive');
    }

    public title(): Observable<string> {
        return this._context.getDocument().pipe(
            map(doc => doc.archived ? 'Unarchive' : 'Archive')
        );
    }

    public toolTip(): Observable<string> {
        return this.title();
    }

    public trigger(context?: ReactiveToolContext) {
        this._context.getDocumentOnce().subscribe(({id, archived}) => {
            this._store.dispatch([
                new DocumentsPatchAction(id, {archived: !archived}),
                new SideBarsTokenToggleAction(ARCHIVED_SIDE_BAR_TOKEN)
            ]);
        });
    }
}
