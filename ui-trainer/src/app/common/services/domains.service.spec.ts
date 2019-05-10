import { TestBed } from '@angular/core/testing';

import { DomainsService } from './domains.service';

describe('DomainsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DomainsService = TestBed.get(DomainsService);
    expect(service).toBeTruthy();
  });
});
