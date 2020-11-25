import { BehaviorSubject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { EmailInput } from '../email-input.component';

describe('Component EmailInput', () => {
  const EMAIL_INPUT_TAG = 'email-input';
  const ELEMENT_ID = 'email-input';
  let emailInputElement: EmailInput;
  const valueSubject = new BehaviorSubject('');
  const errorSubject = new BehaviorSubject('');
  const subscriptions = new Subscription();

  const getShadowRoot = (tagName: string): ShadowRoot => {
    return document.body.getElementsByTagName(tagName)[0].shadowRoot;
  };

  beforeEach(() => {
    emailInputElement = window.document.createElement(
      EMAIL_INPUT_TAG,
    ) as EmailInput;
    emailInputElement.value$ = valueSubject;
    emailInputElement.error$ = errorSubject;

    document.body.appendChild(emailInputElement);
  });

  afterEach(() => {
    document.body.getElementsByTagName(EMAIL_INPUT_TAG)[0].remove();
  });

  afterAll(() => {
    subscriptions.unsubscribe();
  });

  it('show error message', async () => {
    const testErrorMessage = 'Error Test';
    errorSubject.next(testErrorMessage);
    await emailInputElement.updateComplete;

    const renderedText = getShadowRoot(EMAIL_INPUT_TAG)
      .getElementById(ELEMENT_ID)
      .getElementsByClassName('error')[0].innerHTML;

    expect(renderedText).toEqual(testErrorMessage);
  });
  it('enter correct email', (done) => {
    const testEmail = 'a@a.com';

    // check changes sent
    subscriptions.add(
      valueSubject.pipe(take(1)).subscribe({
        next: (dataSent) => {
          expect(dataSent).toBe(testEmail);
        },
        complete: () => {
          done();
        },
        error: (err) => {
          done(err);
        },
      }),
    );

    // Launch change event
    const event = new Event('change');
    (event.target as HTMLInputElement).value = testEmail;
    getShadowRoot(EMAIL_INPUT_TAG)
      .getElementById(ELEMENT_ID)
      .dispatchEvent(event);
  });
});
