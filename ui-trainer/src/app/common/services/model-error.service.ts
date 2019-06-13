import { Injectable } from '@angular/core';

// cdk
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

// rxjs
import { Observable, Subject } from 'rxjs';
import { mapTo, scan, map, mergeMap } from 'rxjs/operators';

import { ModelErrorComponent } from '../../common/modals/model-error/model-error.component';

@Injectable({
  providedIn: 'root'
})
export class ModelErrorService {

  private modelErrorTopRef = this.cdkModelErrorCreate();

  modelError$: Subject<boolean> = new Subject();

  constructor(private overlay: Overlay) {
    this.modelError$.asObservable().pipe(
      map(val => val ? 1 : -1 ),
      scan((acc, one) => (acc + one) >= 0 ? acc + one : 0, 0)
    ).subscribe(
      (res) => {
        if (res === 1) {
          this.showModelError();
        } else if (res === 0 ) {
          // tslint:disable-next-line: no-unused-expression
          this.modelErrorTopRef.hasAttached() ? this.hideModelError() : null;
        }
      }
    );
  }

  private cdkModelErrorCreate() {
    return this.overlay.create({
        hasBackdrop: true,
        backdropClass: 'dark-backdrop',
        positionStrategy: this.overlay.position()
            .global()
            .centerHorizontally()
            .centerVertically()
    });
  }

  private showModelError() {
    console.log('attach');
    this.modelErrorTopRef.attach(new ComponentPortal(ModelErrorComponent));
  }

  private hideModelError() {
    console.log('dispose');
    this.modelErrorTopRef.detach() ;
  }
}
