import { Injectable } from '@angular/core';

// cdk
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

// rxjs
import { Observable, Subject } from 'rxjs';
import { mapTo, scan, map, mergeMap } from 'rxjs/operators';

import { TryNowLoadComponent } from '../../try-now-load/try-now-load.component';

@Injectable({
  providedIn: 'root'
})
export class TryNowLoadService {

  private spinnerTopRef = this.cdkSpinnerCreate();

  spin$: Subject<boolean> = new Subject();

  constructor(private overlay: Overlay) {
    this.spin$.asObservable().pipe(
      map(val => val ? 1 : -1 ),
      scan((acc, one) => (acc + one) >= 0 ? acc + one : 0, 0)
    ).subscribe(
      (res) => {
        if (res === 1) {
          this.showSpinner();
        } else if (res === 0 ) {
          // tslint:disable-next-line: no-unused-expression
          this.spinnerTopRef.hasAttached() ? this.stopSpinner() : null;
        }
      }
    );
  }

  private cdkSpinnerCreate() {
    return this.overlay.create({
        hasBackdrop: true,
        backdropClass: 'dark-backdrop',
        positionStrategy: this.overlay.position()
            .global()
            .centerHorizontally()
            .centerVertically()
    });
  }

  private showSpinner() {
    console.log('attach');
    this.spinnerTopRef.attach(new ComponentPortal(TryNowLoadComponent));
  }

  private stopSpinner() {
    console.log('dispose');
    this.spinnerTopRef.detach() ;
  }
}
