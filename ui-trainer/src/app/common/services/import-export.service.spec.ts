import { TestBed } from '@angular/core/testing';

import { ImportExportService } from './import-export.service';

describe('ImportExportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImportExportService = TestBed.get(ImportExportService);
    expect(service).toBeTruthy();
  });
});
