import {DocumentEntity} from '../../../shared/networks/entities/document.entity';

export class DocumentsAddAction {
    public static readonly type: string = '[Documents] add';

    public constructor(public readonly entity: DocumentEntity) {

    }
}
