import { TestBed } from '@angular/core/testing';

import { DeleteUserService } from './delete-user.service';

describe('DeleteUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeleteUserService = TestBed.get(DeleteUserService);
    expect(service).toBeTruthy();
  });
});
