export interface JobFilters {
  type?: string;
  location?: string;
  experience?: number;
  salary?: {
    min: number;
    max: number;
  };
}

export interface SearchState {
  searchTerm: string;
  filters: JobFilters;
}