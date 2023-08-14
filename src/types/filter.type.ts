export type SearchFilter = {
  search: (value: string) => SearchFilterMatch[];
};

export type SearchFilterMatch = {
  description: string;
  data: { [key: string]: any };
};
