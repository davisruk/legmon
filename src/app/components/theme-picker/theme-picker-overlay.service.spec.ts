import { TestBed, inject } from '@angular/core/testing';

import { ThemePickerOverlayService } from './theme-picker-overlay.service';

describe('ThemePickerOverlayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemePickerOverlayService]
    });
  });

  it('should be created', inject([ThemePickerOverlayService], (service: ThemePickerOverlayService) => {
    expect(service).toBeTruthy();
  }));
});
