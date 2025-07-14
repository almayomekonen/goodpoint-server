export type FilterSetting<T> = {
    columnKey: keyof T;
    optionKey?: string | string[];
    dropDownKey: string;
    filter: ((value: T[keyof T]) => boolean) | ((value: T[keyof T]) => boolean)[];
};

export interface ActionParams<T> {
    allChecked: boolean;
    userSearch?: string;
    filters: FilterSetting<T>[];
}
