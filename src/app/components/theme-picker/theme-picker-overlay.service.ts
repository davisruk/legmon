import { Injectable, ElementRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef, OriginConnectionPosition, ConnectedPosition } from '@angular/cdk/overlay';
import { ThemePickerComponent } from './theme-picker.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';

interface ThemePickerOverlayConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  closeOnClick?: boolean;
}

const DEFAULT_CONFIG: ThemePickerOverlayConfig = {
  hasBackdrop: true
};

export class ThemePickerOverlayRef {
  constructor (private overlayRef: OverlayRef) { }
  close(): void {
    this.overlayRef.dispose();
  }
}

@Injectable({
  providedIn: 'root'
})
export class ThemePickerOverlayService {

  private _backDropClicked: Subject<boolean> = new Subject<boolean>();
  backDropClicked = this._backDropClicked.asObservable();

  constructor(private overlay: Overlay) { }
  parent: ElementRef;

  open(parent: ElementRef, config?: ThemePickerOverlayConfig): ThemePickerOverlayRef {
    // need the parent for the position information
    this.parent = parent;
    const themePickerConfig = { ...DEFAULT_CONFIG, ...config };
    const overlayRef = this.createOverlay(themePickerConfig);
    const themePickerPortal = new ComponentPortal (ThemePickerComponent);
    overlayRef.attach(themePickerPortal);
    const themePickerOverlayRef = new ThemePickerOverlayRef(overlayRef);

    // Closes the overlay if a click is detected on the backdrop, obviously
    // will only work if hasBackdrop is true in the ThemePickerOverlayConfig
    overlayRef.backdropClick().subscribe(_ => {
      this._backDropClicked.next(true);
      themePickerOverlayRef.close();
    });
    return themePickerOverlayRef;
  }

  private createOverlay(config: ThemePickerOverlayConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private getOverlayConfig(config: ThemePickerOverlayConfig): OverlayConfig {
    const pos: ConnectedPosition[] = [{offsetX: -75, offsetY: 0,
                                       originX: 'start', originY: 'bottom',
                                       overlayX: 'start', overlayY: 'top'}];
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.parent)
      .withPositions(pos);

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      height: '150px',
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy
    });

    return overlayConfig;
  }
}

