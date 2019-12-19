import { TestBed } from '@angular/core/testing';

import { CinemahallService } from './cinemahall.service';

describe('CinemahallService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CinemahallService = TestBed.get(CinemahallService);
    expect(service).toBeTruthy();
  });
});
