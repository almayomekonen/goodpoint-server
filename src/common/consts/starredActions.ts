export const starredActions = {
    add: 'add',
    remove: 'remove',
} as const;

export type StarredActions = keyof typeof starredActions;
