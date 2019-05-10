import { TestBed } from '@angular/core/testing';

import { DomainsDataService } from './domains-data.service';

describe('DomainsDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DomainsDataService = TestBed.get(DomainsDataService);
    expect(service).toBeTruthy();
  });
});
