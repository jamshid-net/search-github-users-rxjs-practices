
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EMPTY, Observable, Subject, catchError, debounceTime, distinctUntilChanged, filter, fromEvent, map, range, switchMap, tap } from 'rxjs';
import { HttpClient} from "@angular/common/http";
import { error } from 'console';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef;


  githubUsers$!:Observable<GitHubUser[]>;

  forSkeleton:number[] = [];
  url: string = 'https://api.github.com/search/users?q=';
  constructor(private http: HttpClient) 
  {
       range(1,10).subscribe(numbers=>
        {
            this.forSkeleton.push(numbers);
        })
  }

  ngAfterViewInit(): void {
    const fromInput$ = fromEvent(this.searchInput.nativeElement, 'input');
    
    fromInput$.pipe()

    this.githubUsers$ = fromInput$
      .pipe(
        map((event) => {
          const inputEvent = event as InputEvent;
          const test = inputEvent.target as HTMLInputElement;

          return test.value;
        }),
      
        debounceTime(1000),
        distinctUntilChanged(),
        filter(x=> x!==''),
        tap((value) => value=''),
        switchMap((searchValue) => this.http.get(this.url + searchValue).pipe(
          catchError(err=>
            {
              return EMPTY;
            })
        )),
        map((githubItem: { items?: GitHubUser[] }) => {
          const githubUsers: GitHubUser[] = (githubItem.items || []) as GitHubUser[];
          return githubUsers;
        })
      );
  }

  
}
interface GitHubUser {
  avatar_url: string;
  events_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  gravatar_id: string;
  html_url: string;
  id: number;
  login: string;
  node_id: string;
  organizations_url: string;
  received_events_url: string;
  repos_url: string;
  score: number;
  site_admin: boolean;
  starred_url: string;
  subscriptions_url: string;
  type: string;
  url: string;
}
 
