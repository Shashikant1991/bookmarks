import {Action, Selector, State, StateContext} from '@ngxs/store';
import {DocumentEntity} from '../../shared/networks/entities/document.entity';
import {EntityMap} from '../../shared/networks/entities/entity-map';
import {AppSequenceAction} from '../app/app-sequence.action';
import {EditorModel} from '../models/editor-model';
import {CardEditorState} from './card-editor/card-editor.state';
import {CardsUnpublishAction} from './cards/cards-unpublish.action';
import {CardsState} from './cards/cards.state';
import {DocumentsState} from './documents/documents.state';
import {DragState} from './drag/drag.state';
import {EditorCardIdAction} from './editor-card-id.action';
import {EditorGetDocumentAction} from './editor-get-document.action';
import {EditorSetDocumentAction} from './editor-set-document.action';
import {EditorShowUrlsAction} from './editor-show-urls.action';
import {EditorUnpublishAction} from './editor-unpublish.action';
import {EditorUnsetDocumentAction} from './editor-unset-document.action';
import {GroupsUnpublishAction} from './groups/groups-unpublish.action';
import {GroupsState} from './groups/groups.state';
import {ItemsUnpublishAction} from './items/items-unpublish.action';
import {ItemsState} from './items/items.state';
import {LabelsState} from './labels/labels.state';
import {SelectionsState} from './selections/selections.state';

type EditorContext = StateContext<EditorModel>;

@State<EditorModel>({
    name: 'editor',
    defaults: {
        card_id: null,
        document_id: null,
        show_urls: false
    },
    children: [
        CardEditorState,
        CardsState,
        DocumentsState,
        DragState,
        GroupsState,
        ItemsState,
        LabelsState,
        SelectionsState
    ]
})
export class EditorState {
    @Selector()
    public static cardId(state: EditorModel) {
        return state.card_id;
    }

    @Selector([DocumentsState])
    public static document(state: EditorModel, documents: EntityMap<DocumentEntity>) {
        if (state.document_id !== null) {
            return documents[state.document_id];
        }
        return undefined;
    }

    @Selector()
    public static documentId(state: EditorModel) {
        return state.document_id;
    }

    @Selector()
    public static showUrls(state: EditorModel) {
        return state.show_urls;
    }

    @Action(EditorCardIdAction)
    public EditorCardIdAction(ctx: EditorContext, action: EditorCardIdAction) {
        ctx.patchState({card_id: action.card_id});
    }

    @Action(EditorUnpublishAction)
    public EditorUnpublishAction(ctx: EditorContext) {
        return ctx.dispatch(new AppSequenceAction([
            new ItemsUnpublishAction(),
            new CardsUnpublishAction(),
            new GroupsUnpublishAction(),
        ]));
    }

    @Action(EditorSetDocumentAction)
    public editorDocumentAction(ctx: EditorContext, action: EditorSetDocumentAction) {
        const documentId = ctx.getState().document_id;
        ctx.patchState({document_id: action.document.id});
        if (documentId !== null) {
            return ctx.dispatch(new EditorUnsetDocumentAction(documentId));
        }
    }

    @Action(EditorGetDocumentAction)
    public editorPublishAction(ctx: EditorContext, action: EditorGetDocumentAction) {
        action.child.document_id = ctx.getState().document_id;
        return ctx.dispatch(action.child);
    }

    @Action(EditorShowUrlsAction)
    public editorShowUrlsAction(ctx: EditorContext, {show_urls}: EditorShowUrlsAction) {
        ctx.patchState({show_urls});
    }
}
