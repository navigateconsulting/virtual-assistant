import { TestBed } from '@angular/core/testing';

import { SideDrawerService } from './side-drawer.service';

describe('SideDrawerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SideDrawerService = TestBed.get(SideDrawerService);
    expect(service).toBeTruthy();
  });
});
