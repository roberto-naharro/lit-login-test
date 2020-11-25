import {
  LitElement,
  html,
  property,
  internalProperty,
  TemplateResult,
  query,
} from 'lit-element';
import { fromEvent } from 'rxjs';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

export abstract class GeneralInput extends LitElement {
  @internalProperty()
  type: string;

  @property()
  value$: BehaviorSubject<string>;

  @property()
  error$: BehaviorSubject<string> = new BehaviorSubject('');

  @internalProperty()
  subs = new Subscription();

  @query('input')
  inputElement;

  constructor() {
    super();
    if (!this.value$) {
      throw new Error('Value listener must be passed in');
    }

    // Listen to input changes
    this.subs.add(
      fromEvent<InputEvent>(this.inputElement, 'change')
        .pipe(map((e) => (e.target as HTMLInputElement).value))
        .subscribe({
          next: (v) => {
            const error = this._getValidationsErrors(v);
            if (error) {
              this.error$.next(error);
              this.value$.next('');
            } else {
              this.error$.next('');
              this.value$.next(v);
            }
          },
        }),
    );

    // Listen to errors coming from parent
    this.subs.add(
      this.error$.subscribe(() => {
        this.requestUpdate();
      }),
    );
  }

  render(): TemplateResult {
    return html`
      <input type="${this.type}" />${this.error$.value
        ? html`<span class="error">${this.error$.value}</span>`
        : ''}
    `;
  }

  abstract _getValidationsErrors(value: string): string;
}
