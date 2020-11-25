import {
  LitElement,
  html,
  property,
  internalProperty,
  customElement,
  TemplateResult,
  eventOptions,
} from 'lit-element';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoginCredentials } from './interfaces/login-credentials.interface';
import { LoginResult } from './interfaces/login-result.interface';

import './input/email-input.component';
import './input/password-input.component';

@customElement('get-credentials')
export class GetCredentials extends LitElement {
  @property()
  loginCredential$: BehaviorSubject<LoginCredentials>;

  @property()
  result$: BehaviorSubject<LoginResult>;

  @internalProperty()
  email$ = new BehaviorSubject('');

  @internalProperty()
  password$ = new BehaviorSubject('');

  @internalProperty()
  subs = new Subscription();

  constructor() {
    super();
    if (!this.loginCredential$) {
      throw new Error('Login credentials listener must be passed in');
    }
    if (!this.result$) {
      throw new Error('API call result listener must be passed in');
    }
  }

  render(): TemplateResult {
    // Extract the email error from API call result
    const emailError: Observable<string> = this.result$
      ? this.result$.pipe(
          map<LoginResult, string>((result) =>
            result.error ? result.error.email : '',
          ),
        )
      : of('');
    // Extract the email error from API call result
    const passwordError: Observable<string> = this.result$
      ? this.result$.pipe(
          map<LoginResult, string>((result) =>
            result.error ? result.error.password : '',
          ),
        )
      : of('');
    return html`
      <div class="icon"></div>
      <email-input
        .value$="${this.email$}"
        .error$="${emailError}"
      ></email-input>
      <password-input
        .value$="${this.password$}"
        .error$="${passwordError}"
      ></password-input>
      <button type="button" @click=${this._sendLoginInformation}>Log In</button>
    `;
  }

  @eventOptions({ capture: true })
  _sendLoginInformation(): void {
    this.loginCredential$.next({
      email: this.email$.value,
      password: this.password$.value,
    });
  }
}
