import { TestBed } from '@angular/core/testing';

import { SharedDataService } from './shared-data.service';

describe('SharedDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedDataService = TestBed.get(SharedDataService);
    expect(service).toBeTruthy();
  });
});
