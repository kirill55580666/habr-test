export type GetArrayItemType<T> = T extends Array<infer U> ? U : never;
