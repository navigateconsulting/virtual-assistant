import { TestBed } from '@angular/core/testing';

import { TryNowLoadService } from './try-now-load.service';

describe('TryNowLoadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TryNowLoadService = TestBed.get(TryNowLoadService);
    expect(service).toBeTruthy();
  });
});
