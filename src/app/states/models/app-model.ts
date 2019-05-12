import {EntityIdType} from '../../shared/networks/networks.types';

export interface AppHtmlMeta {
    /**
     * Page description
     */
    description?: string;
    /**
     * Page title
     */
    title: string;
}

export interface AppModel {
    archive_ids: EntityIdType[];
    document_ids: EntityIdType[];
    meta: AppHtmlMeta;
    networkRead: boolean;
    networkWrite: boolean;
    search: boolean;
}
