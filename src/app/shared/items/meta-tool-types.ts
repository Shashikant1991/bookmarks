export interface MetaToolState {
    color?: 'success' | 'warning' | 'danger' | 'info';
    disabled: boolean;
    icon: string;
    title: string;
    toolTip: string;
}

export interface MetaToolData {
    image?: string;
    success: boolean;
    title?: string;
}

export const META_TOOL_DEFAULT: MetaToolState = {
    disabled: false,
    icon: 'cloud-download-alt',
    title: '',
    toolTip: 'Fetch page title'
};

export const META_TOOL_FETCHING: MetaToolState = {
    disabled: true,
    icon: 'spinner',
    title: 'Fetching a title for the bookmark...',
    toolTip: 'Fetching page title'
};

export const META_TOOL_SUCCESS: MetaToolState = {
    disabled: false,
    icon: 'check',
    title: 'Title was successfully fetched.',
    toolTip: 'Success',
    color: 'success'
};

export const META_TOOL_NO_TITLE: MetaToolState = {
    disabled: false,
    icon: 'check',
    title: 'No page title was found.',
    toolTip: 'Success',
    color: 'success'
};

export const META_TOOL_CONTENT_TYPE: MetaToolState = {
    disabled: false,
    icon: 'question-circle',
    title: 'No page title for this content type.',
    toolTip: 'Notice',
    color: 'warning'
};

export const META_TOOL_ERROR: MetaToolState = {
    disabled: false,
    icon: 'exclamation-triangle',
    title: 'Unable to fetch title for bookmark.',
    toolTip: 'Problem',
    color: 'danger'
};
