import {EntityIdType} from '../../shared/networks/networks.types';
import {ActionDocumentId} from '../actions/action-document-id';

export class EditorUnsetDocumentAction implements ActionDocumentId {
    public static readonly type: string = '[Editor] unset document';

    public constructor(public readonly document_id: EntityIdType) {

    }
}
