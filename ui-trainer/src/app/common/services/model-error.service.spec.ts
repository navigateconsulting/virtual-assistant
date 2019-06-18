import { TestBed } from '@angular/core/testing';

import { ModelErrorService } from './model-error.service';

describe('ModelErrorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModelErrorService = TestBed.get(ModelErrorService);
    expect(service).toBeTruthy();
  });
});
