export enum NotificationType {
    SUCCESS = 'SUCCESS',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
}

export interface INotification {
    id: number,
    type: NotificationType,
    title: string,
    content: string,
}

export interface INewNotification {
    type: NotificationType,
    title: string,
    content: string,
}