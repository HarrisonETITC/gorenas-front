export interface EventMessage {
    event: 'create' | 'update' | 'delete' | 'done' | 'error' | 'close' | '';
    message?: string;
}