export interface DialogConfirmAction {
    color: string;
    title: string;
}

export interface DialogConfirmOptions {
    cancel: Partial<DialogConfirmAction>;
    icon: string;
    message: string;
    okay: Partial<DialogConfirmAction>;
    title: string;
}
