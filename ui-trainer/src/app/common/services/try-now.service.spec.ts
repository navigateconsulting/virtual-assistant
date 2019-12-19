import { TestBed } from '@angular/core/testing';

import { TryNowService } from './try-now.service';

describe('TryNowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TryNowService = TestBed.get(TryNowService);
    expect(service).toBeTruthy();
  });
});
