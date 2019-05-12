import {Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {LogService} from '../../dev-tools/log/log.service';
import {ReactiveToolConfig} from '../../reactive-tools/reactive-tool';
import {DocumentContext} from './document-context.service';
import {DocumentMoveService} from './document-move.service';

@Injectable()
export class DocumentMoveDownService extends DocumentMoveService {
    public readonly config: Partial<ReactiveToolConfig> = {
        order: '0200:0200'
    };

    public constructor(store: Store, context: DocumentContext, log: LogService) {
        super(store, context, 'down', log.withPrefix(DocumentMoveDownService.name));
    }
}
