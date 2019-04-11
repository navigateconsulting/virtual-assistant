import { TestBed } from '@angular/core/testing';

import { QueryUserService } from './query-user.service';

describe('QueryUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueryUserService = TestBed.get(QueryUserService);
    expect(service).toBeTruthy();
  });
});
