import { TestBed } from '@angular/core/testing';

import { CreateUserService } from './create-user.service';

describe('CreateUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateUserService = TestBed.get(CreateUserService);
    expect(service).toBeTruthy();
  });
});
