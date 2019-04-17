import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoriesDataService {

  stories: any;
  storiesSource: BehaviorSubject<any>;
  newStory: any;

  constructor() {
    this.stories = sessionStorage.getItem('stories_json');
    if (this.stories !== null && this.stories !== '') {
      const stories_string_arr = this.stories.split('*');
      this.stories = this.convertToArrayOfObject(stories_string_arr);
    }
    this.storiesSource = new BehaviorSubject(this.stories);
    this.newStory = this.storiesSource.asObservable();
  }

  changeStory(stories: any) {
    this.storiesSource.next(stories);
  }

  convertToArrayOfObject(stories: any) {
    stories.forEach(function (value: any, index: number) {
      stories[index] = JSON.parse(value);
    });
    return stories;
  }

  convertToArrayOfString(stories: any) {
    stories.forEach(function (value: any, index: number) {
      stories[index] = JSON.stringify(value);
    });
    return stories;
  }
}
