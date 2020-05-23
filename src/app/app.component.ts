import { Component, OnInit } from '@angular/core';
import { Octokit } from '@octokit/rest';
import { GithubService } from './github.service';

import { Repo } from './repo';
import { SearchResponse } from './search-response';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ghClient: Octokit;
  title = 'gh-search';
  repos: Repo[];
  isFirstPage = false;
  prevPageUrl: string;
  isLastPage = false;
  nextPageUrl: string;
  query: string;

  constructor(private githubService: GithubService) {}

  ngOnInit() {}

  async onSearch(input: string) {
    this.query = input;

    const response = await this.githubService.search(this.query);
    this.updateState(response);
  }

  async onPreviousClick() {
    const response = await this.githubService.fetch(this.prevPageUrl);
    this.updateState(response);
  }

  async onNextClick() {
    const response = await this.githubService.fetch(this.nextPageUrl);
    this.updateState(response);
  }

  updateState(response: SearchResponse) {
    this.repos = response.repos;

    this.prevPageUrl = response.prevPageUrl;
    this.nextPageUrl = response.nextPageUrl;

    this.isFirstPage = !response.prevPageUrl;
    this.isLastPage = !response.nextPageUrl;
  }
}
