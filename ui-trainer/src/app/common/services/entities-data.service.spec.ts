import { TestBed } from '@angular/core/testing';

import { EntitiesDataService } from './entities-data.service';

describe('EntitiesDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EntitiesDataService = TestBed.get(EntitiesDataService);
    expect(service).toBeTruthy();
  });
});
