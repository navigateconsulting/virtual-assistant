import { TestBed } from '@angular/core/testing';

import { UpdateUserService } from './update-user.service';

describe('UpdateUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpdateUserService = TestBed.get(UpdateUserService);
    expect(service).toBeTruthy();
  });
});
