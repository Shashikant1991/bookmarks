export interface TopBarRefreshState {
    animate?: string;
    color?: 'success' | 'warning' | 'danger' | 'info';
    disabled?: boolean;
    icon: string;
    title: string;
}

export const REFRESH_TOOL_DEFAULT: TopBarRefreshState = {
    icon: 'sync',
    title: 'Refresh'
};

export const REFRESH_TOOL_READ: TopBarRefreshState = {
    disabled: true,
    animate: 'pulse',
    icon: 'spinner',
    title: 'Loading...'
};

export const REFRESH_TOOL_WRITE: TopBarRefreshState = {
    disabled: true,
    animate: 'pulse',
    icon: 'spinner',
    title: 'Saving...'
};

export const REFRESH_TOOL_SUCCESS: TopBarRefreshState = {
    disabled: true,
    icon: 'check',
    title: 'Saved',
    color: 'success'
};

export const SAVE_CHANGES_FATAL_ERROR: TopBarRefreshState = {
    disabled: false,
    icon: 'exclamation-triangle',
    title: 'Changes could not be saved',
    color: 'danger'
};

export const REFRESH_TOOL_ERROR: TopBarRefreshState = {
    disabled: false,
    icon: 'exclamation-triangle',
    title: 'Network difficulties...',
    color: 'danger'
};
