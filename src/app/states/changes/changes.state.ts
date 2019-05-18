import {Action, Selector, State, StateContext} from '@ngxs/store';
import {switchMap} from 'rxjs/operators';
import {DocumentsService} from '../../shared/api/documents/documents.service';
import {LogService} from '../../shared/dev-tools/log/log.service';
import {EntityChange, EntityChangeEnum} from '../../shared/networks/networks.types';
import {DocumentsAddAction} from '../editor/documents/documents-add.action';
import {ChangesModel} from '../models/changes-model';
import {ChangesCreateAction} from './changes-create.action';
import {ChangesDeleteAction} from './changes-delete.action';
import {ChangesFailureAction} from './changes-failure.action';
import {ChangesPatchAction} from './changes-patch.action';
import {ChangesSavedAction} from './changes-saved.action';
import {ChangesSendAction} from './changes-send.action';

type ChangesContext = StateContext<ChangesModel>;

const CHANGES_DEFAULT: ChangesModel = {
    document_id: null,
    error: null,
    queued: null,
    sending: null
};

/**
 * @deprecated
 */
@State<ChangesModel>({
    name: 'changes',
    defaults: CHANGES_DEFAULT
})
export class ChangesState {
    private readonly _log: LogService;

    public constructor(private _documentsService: DocumentsService,
                       log: LogService) {
        this._log = log.withPrefix(ChangesState.name);
    }

    @Selector()
    public static fatalError(state: ChangesModel) {
        return state.error === 'fatal';
    }

    @Selector()
    public static queued(state: ChangesModel) {
        return state.queued;
    }

    @Selector()
    public static sending(state: ChangesModel) {
        return state.sending;
    }

    @Action(ChangesCreateAction)
    public changeCreate(ctx: ChangesContext, {change}: ChangesCreateAction) {
        const state = ctx.getState();
        const document_id = state.document_id;
        const queued = (state.queued || []).slice();
        queued.push(Object.assign({}, change, {document_id}));
        ctx.patchState({queued});
    }

    @Action(ChangesDeleteAction)
    public changesDeleteAction(ctx: ChangesContext, {change}: ChangesDeleteAction) {
        const state = ctx.getState();
        const document_id = state.document_id;
        const queued = (state.queued || []).slice();
        queued.push(Object.assign({}, change, {document_id}));
        ctx.patchState({queued});
    }

    @Action(ChangesPatchAction)
    public changesEditAction(ctx: ChangesContext, {change}: ChangesPatchAction) {
        const state = ctx.getState();
        const document_id = change.model !== 'documents' ? state.document_id : undefined;
        const queued = (state.queued || []).slice();
        let last = queued.length ? queued[queued.length - 1] : false;
        if (last
            && last.id === change.id
            && last.document_id === document_id
            && last.model === change.model
            && [EntityChangeEnum.PATCH, EntityChangeEnum.CREATE].includes(last.type)) {
            last = <EntityChange>JSON.parse(JSON.stringify(last));
            Object.assign(last.value, change.value);
            queued[queued.length - 1] = last;
        } else {
            queued.push(Object.assign({}, change, {document_id}));
        }
        ctx.patchState({queued});
    }

    @Action(ChangesFailureAction)
    public changesFailureAction(ctx: ChangesContext, {error}: ChangesFailureAction) {
        ctx.patchState({error, sending: null});
    }

    @Action(ChangesSavedAction)
    public changesSavedAction(ctx: ChangesContext) {
        ctx.patchState({sending: null});
    }

    @Action(ChangesSendAction)
    public changesSendAction(ctx: ChangesContext) {
        const state = ctx.getState();
        if (state.queued && state.queued.length) {
            const sending = state.queued;
            ctx.patchState({queued: null, sending});
            return this._documentsService
                .changes(sending)
                .pipe(
                    switchMap(resp => {
                        if (resp && resp.status === 'success') {
                            return ctx.dispatch(new ChangesSavedAction());
                        }
                        return ctx.dispatch(new ChangesFailureAction('fatal', sending));
                    })
                );
        }
    }

    @Action(DocumentsAddAction)
    public editorDocumentAction(ctx: ChangesContext, {document}: DocumentsAddAction) {
        ctx.patchState({document_id: document.id});
    }

    @Action([ChangesCreateAction, ChangesDeleteAction, ChangesPatchAction])
    public requiresDocument(ctx: ChangesContext) {
        const document_id = ctx.getState().document_id;
        if (!document_id) {
            throw new Error('Document ID is not set');
        }
    }
}

