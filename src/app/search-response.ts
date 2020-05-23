import { Repo } from './repo';

export interface SearchResponse {
  repos: Repo[];
  nextPageUrl: string;
  prevPageUrl: string;
}
