import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, timer, Subject } from 'rxjs';
import { retry, catchError, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const CACHE_SIZE = 1;
const REFRESH_INTERVAL = 10000;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private actionsCache$: Observable<any>;
  private reloadActions$ = new Subject<void>();

  // Define API
  apiURL = environment.BASE_URL;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Custom Actions API Start
  requestActions(): Observable<any> {
    if (!this.actionsCache$) {
      // Set up timer that ticks every X milliseconds
      const timer$ = timer(0, REFRESH_INTERVAL);
      // For each tick make an http request to fetch new data
      this.actionsCache$ = timer$.pipe(
        switchMap(_ => this.requestGetActions()),
        takeUntil(this.reloadActions$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.actionsCache$;
  }

  forceActionsCacheReload(type: string) {
    if (type === 'reset') {
      // Calling next will complete the current cache instance
      this.reloadActions$.next();
      // Setting the cache to null will create a new cache the
      this.actionsCache$ = null;
    } else if (type === 'finish') {
      // Calling next will complete the current cache instance
      this.reloadActions$.next();
    }
  }

  requestGetActions() {
    return this.http.get(this.apiURL + '/custom_actions', this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  createAction(stub: any) {
    // tslint:disable-next-line: max-line-length
    return this.http.post(this.apiURL + '/custom_actions', JSON.stringify(stub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  editAction(stub: any) {
    // tslint:disable-next-line: max-line-length
    return this.http.put(this.apiURL + '/custom_actions', JSON.stringify(stub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteAction(objectId: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        object_id: objectId,
      }
    };
    // tslint:disable-next-line: max-line-length
    return this.http.delete(this.apiURL + '/custom_actions', httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  // Custom Action API End

  // Refresh DB API Start
  refreshAppDB() {
    // tslint:disable-next-line: max-line-length
    return this.http.get(this.apiURL + '/refresh_db', this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  // Refresh DB API End

  // Conversations API Start
  private conversationsCache$: Observable<any>;
  private reloadConversations$ = new Subject<void>();

  requestConversations(): Observable<any> {
    if (!this.conversationsCache$) {
      // Set up timer that ticks every X milliseconds
      const timer$ = timer(0, REFRESH_INTERVAL);
      // For each tick make an http request to fetch new data
      this.conversationsCache$ = timer$.pipe(
        switchMap(_ => this.requestGetConversations()),
        takeUntil(this.reloadConversations$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.conversationsCache$;
  }

  requestGetConversations() {
    return this.http.get(this.apiURL + '/all_conversations', this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  requestConversationChats(conversationId: string) {
    return this.http.get(this.apiURL + '/conversation/' + conversationId, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  forceConversationsCacheReload(type: string) {
    if (type === 'reset') {
      // Calling next will complete the current cache instance
      this.reloadConversations$.next();
      // Setting the cache to null will create a new cache the
      this.conversationsCache$ = null;
    } else if (type === 'finish') {
       // Calling next will complete the current cache instance
      this.reloadConversations$.next();
    }
  }
  // Conversations API End

  // Projects API Start
  private projectsCache$: Observable<any>;
  private reloadProjects$ = new Subject<void>();

  requestProjects(): Observable<any> {
    if (!this.projectsCache$) {
      // Set up timer that ticks every X milliseconds
      const timer$ = timer(0, REFRESH_INTERVAL);
      // For each tick make an http request to fetch new data
      this.projectsCache$ = timer$.pipe(
        switchMap(_ => this.requestGetProjects()),
        takeUntil(this.reloadProjects$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.projectsCache$;
  }

  forceProjectsCacheReload(type: string) {
    if (type === 'reset') {
      // Calling next will complete the current cache instance
      this.reloadProjects$.next();
      // Setting the cache to null will create a new cache the
      this.projectsCache$ = null;
    } else if (type === 'finish') {
      // Calling next will complete the current cache instance
      this.reloadProjects$.next();
    }
  }

  requestGetProjects() {
    return this.http.get(this.apiURL + '/projects', this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  createProject(stub: any) {
    // tslint:disable-next-line: max-line-length
    return this.http.post(this.apiURL + '/projects', JSON.stringify(stub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  editProject(stub: any) {
    // tslint:disable-next-line: max-line-length
    return this.http.put(this.apiURL + '/projects', JSON.stringify(stub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteProject(objectId: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        object_id: objectId,
      }
    };
    // tslint:disable-next-line: max-line-length
    return this.http.delete(this.apiURL + '/projects', httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  copyProject(stub: any) {
    // tslint:disable-next-line: max-line-length
    return this.http.post(this.apiURL + '/copy_project', JSON.stringify(stub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  // Projects API Start

  // Domains API Start
  private domainsCache$: Observable<any>;
  private reloadDomains$ = new Subject<void>();

  requestDomains(projectObjectId: string): Observable<any> {
    if (!this.domainsCache$) {
      // Set up timer that ticks every X milliseconds
      const timer$ = timer(0, REFRESH_INTERVAL);
      // For each tick make an http request to fetch new data
      this.domainsCache$ = timer$.pipe(
        switchMap(_ => this.requestGetDomains(projectObjectId)),
        takeUntil(this.reloadDomains$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.domainsCache$;
  }

  forceDomainsCacheReload(type: string) {
    if (type === 'reset') {
      // Calling next will complete the current cache instance
      this.reloadDomains$.next();
      // Setting the cache to null will create a new cache the
      this.domainsCache$ = null;
    } else if (type === 'finish') {
      // Calling next will complete the current cache instance
      this.reloadDomains$.next();
    }
  }

  requestGetDomains(projectObjectId: string) {
    return this.http.get(this.apiURL + '/domains/' + projectObjectId, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  createDomain(stub: any, projectObjectId: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.post(this.apiURL + '/domains/' + projectObjectId, JSON.stringify(stub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  editDomain(stub: any, projectObjectId: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.put(this.apiURL + '/domains/' + projectObjectId, JSON.stringify(stub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteDomain(objectId: any, projectObjectId: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        object_id: objectId,
      }
    };
    // tslint:disable-next-line: max-line-length
    return this.http.delete(this.apiURL + '/domains/' + projectObjectId, httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  // Domains API End

  // Intents API Start
  private intentsCache$: Observable<any>;
  private reloadIntents$ = new Subject<void>();
  private intentDetailsCache$: Observable<any>;
  private reloadIntentDetails$ = new Subject<void>();

  requestIntents(projectObjectId: string, domainObjectId: string): Observable<any> {
    if (!this.intentsCache$) {
      // Set up timer that ticks every X milliseconds
      const timer$ = timer(0, REFRESH_INTERVAL);
      // For each tick make an http request to fetch new data
      this.intentsCache$ = timer$.pipe(
        switchMap(_ => this.requestGetIntents(projectObjectId, domainObjectId)),
        takeUntil(this.reloadIntents$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.intentsCache$;
  }

  requestIntentDetails(intentObjectId: string): Observable<any> {
    if (!this.intentDetailsCache$) {
      // Set up timer that ticks every X milliseconds
      const timer$ = timer(0, REFRESH_INTERVAL);
      // For each tick make an http request to fetch new data
      this.intentDetailsCache$ = timer$.pipe(
        switchMap(_ => this.requestGetIntentDetails(intentObjectId)),
        takeUntil(this.reloadIntentDetails$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.intentDetailsCache$;
  }

  forceIntentsCacheReload(type: string) {
    if (type === 'reset') {
      // Calling next will complete the current cache instance
      this.reloadIntents$.next();
      // Setting the cache to null will create a new cache the
      this.intentsCache$ = null;
    } else if (type === 'finish') {
      // Calling next will complete the current cache instance
      this.reloadIntents$.next();
    }
  }

  forceIntentDetailsCacheReload(type: string) {
    if (type === 'reset') {
      // Calling next will complete the current cache instance
      this.reloadIntentDetails$.next();
      // Setting the cache to null will create a new cache the
      this.intentDetailsCache$ = null;
    } else if (type === 'finish') {
      // Calling next will complete the current cache instance
      this.reloadIntentDetails$.next();
    }
  }

  requestGetIntents(projectObjectId: string, domainObjectId: string) {
    let params = new HttpParams()
    .set('project_id', projectObjectId)
    .set('domain_id', domainObjectId);

    return this.http.get(this.apiURL + '/intents', { params })
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  requestGetIntentDetails(intentObjectId: string) {
    return this.http.get(this.apiURL + '/intent_details/' + intentObjectId, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  createIntent(stub: any) {
    // tslint:disable-next-line: max-line-length
    return this.http.post(this.apiURL + '/intents', JSON.stringify(stub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  createIntentText(stub: any, intentObjectId: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.post(this.apiURL + '/intent_details/' + intentObjectId, JSON.stringify(stub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  editIntent(stub: any) {
    // tslint:disable-next-line: max-line-length
    return this.http.put(this.apiURL + '/intents', JSON.stringify(stub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  editIntentText(stub: any, intentObjectId: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.put(this.apiURL + '/intent_details/' + intentObjectId, JSON.stringify(stub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteIntent(stub: object) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: stub
    };
    // tslint:disable-next-line: max-line-length
    return this.http.delete(this.apiURL + '/intents', httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteIntentText(stub: object, intentObjectId: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: stub
    };
    // tslint:disable-next-line: max-line-length
    return this.http.delete(this.apiURL + '/intent_details/' + intentObjectId, httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  // Intents API End

  // Responses API Start
  private responsesCache$: Observable<any>;
  private reloadResponses$ = new Subject<void>();
  private responseDetailsCache$: Observable<any>;
  private reloadResponseDetails$ = new Subject<void>();

  requestResponses(projectObjectId: string, domainObjectId: string): Observable<any> {
    if (!this.responsesCache$) {
      // Set up timer that ticks every X milliseconds
      const timer$ = timer(0, REFRESH_INTERVAL);
      // For each tick make an http request to fetch new data
      this.responsesCache$ = timer$.pipe(
        switchMap(_ => this.requestGetResponses(projectObjectId, domainObjectId)),
        takeUntil(this.reloadResponses$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.responsesCache$;
  }

  requestResponseDetails(responseObjectId: string): Observable<any> {
    if (!this.responseDetailsCache$) {
      // Set up timer that ticks every X milliseconds
      const timer$ = timer(0, REFRESH_INTERVAL);
      // For each tick make an http request to fetch new data
      this.responseDetailsCache$ = timer$.pipe(
        switchMap(_ => this.requestGetResponseDetails(responseObjectId)),
        takeUntil(this.reloadResponseDetails$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.responseDetailsCache$;
  }

  forceResponsesCacheReload(type: string) {
    if (type === 'reset') {
      // Calling next will complete the current cache instance
      this.reloadResponses$.next();
      // Setting the cache to null will create a new cache the
      this.responsesCache$ = null;
    } else if (type === 'finish') {
      // Calling next will complete the current cache instance
      this.reloadResponses$.next();
    }
  }

  forceResponseDetailsCacheReload(type: string) {
    if (type === 'reset') {
      // Calling next will complete the current cache instance
      this.reloadResponseDetails$.next();
      // Setting the cache to null will create a new cache the
      this.responseDetailsCache$ = null;
    } else if (type === 'finish') {
      // Calling next will complete the current cache instance
      this.reloadResponseDetails$.next();
    }
  }

  requestGetResponses(projectObjectId: string, domainObjectId: string) {
    let params = new HttpParams()
    .set('project_id', projectObjectId)
    .set('domain_id', domainObjectId);

    return this.http.get(this.apiURL + '/responses', { params })
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  requestGetResponseDetails(responseObjectId: string) {
    return this.http.get(this.apiURL + '/responses_details/' + responseObjectId, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  createResponse(stub: any) {
    // tslint:disable-next-line: max-line-length
    return this.http.post(this.apiURL + '/responses', JSON.stringify(stub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  createResponseText(stub: any, responseObjectId: string) {
    return this.http.post(this.apiURL + '/responses_details/' + responseObjectId, JSON.stringify(stub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  editResponse(stub: any) {
    // tslint:disable-next-line: max-line-length
    return this.http.put(this.apiURL + '/responses', JSON.stringify(stub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteResponse(stub: object) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: stub
    };
    // tslint:disable-next-line: max-line-length
    return this.http.delete(this.apiURL + '/responses', httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteResponseText(stub: object, responseObjectId: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: stub
    };
    // tslint:disable-next-line: max-line-length
    return this.http.delete(this.apiURL + '/responses_details/' + responseObjectId, httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  // Responses API End

  // Stories API Start
  private storiesCache$: Observable<any>;
  private reloadStories$ = new Subject<void>();
  private storyDetailsCache$: Observable<any>;
  private reloadStoryDetails$ = new Subject<void>();

  requestStories(projectObjectId: string, domainObjectId: string): Observable<any> {
    if (!this.storiesCache$) {
      // Set up timer that ticks every X milliseconds
      const timer$ = timer(0, REFRESH_INTERVAL);
      // For each tick make an http request to fetch new data
      this.storiesCache$ = timer$.pipe(
        switchMap(_ => this.requestGetStories(projectObjectId, domainObjectId)),
        takeUntil(this.reloadStories$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.storiesCache$;
  }

  requestStoryDetails(storyObjectId: string): Observable<any> {
    if (!this.storyDetailsCache$) {
      // Set up timer that ticks every X milliseconds
      const timer$ = timer(0, REFRESH_INTERVAL);
      // For each tick make an http request to fetch new data
      this.storyDetailsCache$ = timer$.pipe(
        switchMap(_ => this.requestGetStoryDetails(storyObjectId)),
        takeUntil(this.reloadStoryDetails$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.storyDetailsCache$;
  }

  forceStoriesCacheReload(type: string) {
    if (type === 'reset') {
      // Calling next will complete the current cache instance
      this.reloadStories$.next();
      // Setting the cache to null will create a new cache the
      this.storiesCache$ = null;
    } else if (type === 'finish') {
      // Calling next will complete the current cache instance
      this.reloadStories$.next();
    }
  }

  forceStoryDetailsCacheReload(type: string) {
    if (type === 'reset') {
      // Calling next will complete the current cache instance
      this.reloadStoryDetails$.next();
      // Setting the cache to null will create a new cache the
      this.storyDetailsCache$ = null;
    } else if (type === 'finish') {
      // Calling next will complete the current cache instance
      this.reloadStoryDetails$.next();
    }
  }

  requestGetStories(projectObjectId: string, domainObjectId: string) {
    let params = new HttpParams()
    .set('project_id', projectObjectId)
    .set('domain_id', domainObjectId);

    return this.http.get(this.apiURL + '/story', { params })
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  requestGetStoryDetails(storyObjectId: string) {
    return this.http.get(this.apiURL + '/story_details/' + storyObjectId, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  createStory(stub: any) {
    // tslint:disable-next-line: max-line-length
    return this.http.post(this.apiURL + '/story', JSON.stringify(stub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  insertStoryDetails(stub: any, storyObjectId: string) {
    return this.http.post(this.apiURL + '/story_details/' + storyObjectId, JSON.stringify(stub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  editStory(stub: any) {
    // tslint:disable-next-line: max-line-length
    return this.http.put(this.apiURL + '/story', JSON.stringify(stub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateStoryDetails(stub: any, storyObjectId: string) {
    return this.http.put(this.apiURL + '/story_details/' + storyObjectId, JSON.stringify(stub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteStory(stub: object) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: stub
    };
    // tslint:disable-next-line: max-line-length
    return this.http.delete(this.apiURL + '/story', httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteStoryDetails(stub: object, storyObjectId: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: stub
    };
    // tslint:disable-next-line: max-line-length
    return this.http.delete(this.apiURL + '/story_details/' + storyObjectId, httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  // Stories API End

  // Entities API Start
  private entiitesCache$: Observable<any>;
  private reloadEntities$ = new Subject<void>();

  requestEntities(projectObjectId: string): Observable<any> {
    if (!this.entiitesCache$) {
      // Set up timer that ticks every X milliseconds
      const timer$ = timer(0, REFRESH_INTERVAL);
      // For each tick make an http request to fetch new data
      this.entiitesCache$ = timer$.pipe(
        switchMap(_ => this.requestGetEntities(projectObjectId)),
        takeUntil(this.reloadEntities$),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.entiitesCache$;
  }

  forceEntitiesCacheReload(type: string) {
    if (type === 'reset') {
      // Calling next will complete the current cache instance
      this.reloadEntities$.next();
      // Setting the cache to null will create a new cache the
      this.entiitesCache$ = null;
    } else if (type === 'finish') {
      // Calling next will complete the current cache instance
      this.reloadEntities$.next();
    }
  }

  requestGetEntities(projectObjectId: string) {
    return this.http.get(this.apiURL + '/entities/' + projectObjectId, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  createEntity(stub: any, projectObjectId: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.post(this.apiURL + '/entities/' + projectObjectId, JSON.stringify(stub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  editEntity(stub: any, projectObjectId: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.put(this.apiURL + '/entities/' + projectObjectId, JSON.stringify(stub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteEntity(objectId: string, projectObjectId: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        object_id: objectId,
      }
    };
    // tslint:disable-next-line: max-line-length
    return this.http.delete(this.apiURL + '/entities/' + projectObjectId, httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  // Entities API End

  // Import Export Projects API Start

  importProject(projectStub: any) {
    // tslint:disable-next-line: max-line-length
    return this.http.post(this.apiURL + '/import_model', JSON.stringify(projectStub), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  exportProject(projectName: any) {
    // tslint:disable-next-line: max-line-length
    return this.http.post(this.apiURL + '/export_model', JSON.stringify({project_name: projectName}), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  //Import Export Projects API End

  // Error handling
  handleError(error) {
     let errorMessage = '';
     if (error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     window.alert(errorMessage);
     return throwError(errorMessage);
  }
}
