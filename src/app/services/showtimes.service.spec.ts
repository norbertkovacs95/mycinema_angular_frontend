import { TestBed } from '@angular/core/testing';

import { ShowtimesService } from './showtimes.service';

describe('ShowtimesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShowtimesService = TestBed.get(ShowtimesService);
    expect(service).toBeTruthy();
  });
});
