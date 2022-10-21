export type IFieldOptions = {
    value: string,
    disabled: boolean,
}

export type IField = {
    [name: string]: IFieldOptions,
}

export type IFormFields = {
    [key: string]: IField,
}

export enum FormMode {
    CONSULT = 'CONSULT',
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
}