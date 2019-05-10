import { TestBed } from '@angular/core/testing';

import { StoriesDataService } from './stories-data.service';

describe('StoriesDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StoriesDataService = TestBed.get(StoriesDataService);
    expect(service).toBeTruthy();
  });
});
