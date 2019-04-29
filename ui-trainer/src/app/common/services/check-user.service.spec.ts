import { TestBed } from '@angular/core/testing';

import { CheckUserService } from './check-user.service';

describe('CheckUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckUserService = TestBed.get(CheckUserService);
    expect(service).toBeTruthy();
  });
});
