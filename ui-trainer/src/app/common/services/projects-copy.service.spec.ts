import { TestBed } from '@angular/core/testing';

import { ProjectsCopyService } from './projects-copy.service';

describe('ProjectsCopyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectsCopyService = TestBed.get(ProjectsCopyService);
    expect(service).toBeTruthy();
  });
});
