import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  fromEvent,
  interval,
  merge,
  mergeMap,
  Observable,
  Subscription,
  takeUntil,
  tap,
} from 'rxjs';
import { State } from './State.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('startButton', { static: true }) startButton!: ElementRef;
  @ViewChild('stopButton', { static: true }) stopButton!: ElementRef;
  @ViewChild('waitButton', { static: true }) waitButton!: ElementRef;
  @ViewChild('resetButton', { static: true }) resetButton!: ElementRef;

  state = new State(0, 0);

  startClick$!: Observable<PointerEvent>;
  stopClick$!: Observable<PointerEvent>;
  waitClick$!: Observable<PointerEvent>;
  resetClick$!: Observable<PointerEvent>;

  startBtnSubscription$!: Subscription;
  setInterval$ = interval(1000);

  observeButtons() {
    this.startClick$ = fromEvent<PointerEvent>(
      this.startButton.nativeElement,
      'click'
    );
    this.stopClick$ = fromEvent<PointerEvent>(
      this.stopButton.nativeElement,
      'click'
    );
    this.waitClick$ = fromEvent<PointerEvent>(
      this.waitButton.nativeElement,
      'click'
    );
    this.resetClick$ = fromEvent<PointerEvent>(
      this.resetButton.nativeElement,
      'click'
    );
  }

  stopCounting$() {
    return this.stopClick$.pipe(
      tap(() => {
        this.state.setZero();
      })
    );
  }

  waitCounting$() {
    return this.waitClick$.pipe(
      mergeMap(() => {
        return this.waitClick$.pipe(takeUntil(interval(500)));
      }),
      tap(
        this.stopClick$.pipe(
          tap(() => {
            this.state.setZero();
          })
        )
      )
    );
  }

  resetCounting$() {
    return this.resetClick$.pipe(
      tap(() => {
        this.state.setZero();
      })
    );
  }

  counting$() {
    return this.setInterval$.pipe(
      takeUntil(merge(this.stopCounting$(), this.waitCounting$())),
      tap(this.resetCounting$())
    );
  }

  ngAfterViewInit(): void {
    this.observeButtons();
    this.startBtnSubscription$ = this.startClick$
      .pipe(
        mergeMap(() => {
          return this.counting$();
        })
      )
      .subscribe(() => {
        this.state.addOneSec();
      });
  }

  ngOnDestroy(): void {
    this.startBtnSubscription$.unsubscribe();
  }
}
