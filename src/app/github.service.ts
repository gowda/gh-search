import { Injectable } from '@angular/core';
import { Octokit } from '@octokit/rest';

import { SearchResponse } from './search-response';
import { access } from 'fs';

@Injectable({providedIn: 'root'})
export class GithubService {
  private client: Octokit;
  private LINK_SEGMENT_REGEX = /<(?<url>[^]+)>; rel="(?<label>[^"]+)"/;

  constructor() {
    this.client = new Octokit({userAgent: 'gh-search v0.42'});
  }

  parseLinkHeader(headers: any) {
    return headers.link.split(',')
      .map((segment: string) => {
        const { groups: {label, url}} = this.LINK_SEGMENT_REGEX.exec(segment);
        return {[`${label}PageUrl`]: url};
      }).reduce((acc, value) => ({...acc, ...value}), {});
  }

  transform(response) {
    const links = this.parseLinkHeader(response.headers);
    console.log('links', links);

    return {
      repos: response.data.items.map((repo) => {
        return {
          name: repo.name,
          fullname: repo.full_name,
          description: repo.description,
          url: repo.html_url,
          forks: repo.forks_count,
          issues: repo.open_issues_count,
          watchers: repo.watchers_count,
          stars: repo.stargazers_count,
          language: repo.language,
          updatedAt: new Date(repo.updated_at),
          owner: {
            login: repo.owner.login,
            url: repo.owner.url, // FIXME: type augmentation required
            avatarUrl: repo.owner.avatar_url,
          }
        };
      }),
      ...links
    };
  }

  search(q: string): Promise<SearchResponse> {
    return this.client.search
      .repos({q, per_page: 20, sort: 'stars', order: 'desc'})
      .then((resp) => this.transform(resp));
  }

  fetch(url: string): Promise<SearchResponse> {
    return this.client.request({url, method: 'GET'})
      .then((resp) => this.transform(resp));
  }
}
