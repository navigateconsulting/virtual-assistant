import { TestBed } from '@angular/core/testing';

import { ResponsesDataService } from './responses-data.service';

describe('ResponsesDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResponsesDataService = TestBed.get(ResponsesDataService);
    expect(service).toBeTruthy();
  });
});
