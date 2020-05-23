import { User } from './user';

export interface Repo {
  name: string;
  fullname: string;
  owner: User;
  url: string;
  description: string;
  forks: number;
  issues: number;
  watchers: number;
  stars: number;
  language: string;
  updatedAt: Date;
}
