import { TestBed } from '@angular/core/testing';

import { IntentsDataService } from './intents-data.service';

describe('IntentsDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IntentsDataService = TestBed.get(IntentsDataService);
    expect(service).toBeTruthy();
  });
});
