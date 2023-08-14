export type SearchFilter<T> = {
  search: (value: string) => SearchFilterMatch<T>[];
};

export type SearchFilterMatch<T> = {
  description: string;
  data: T;
};
