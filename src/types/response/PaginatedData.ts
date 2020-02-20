export interface PageData<T> {
  data: T[];
  pagination: PageMetaData;
}

export interface PageMetaData {
  page: number;
  totalPages: number;
  items: number;
  totalItems: number;
}

export interface PwPageData<T> {
  data: T[];
  pagination: PwPageMetaData;
}

export interface PwPageMetaData {
  results: {
    from: number;
    to: number;
    total: number;
  };
  pages: {
    current: number;
    prev: number;
    next: number;
    total: number;
  };
}
