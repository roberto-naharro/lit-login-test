import { customElement } from 'lit-element';

import { GeneralInput } from './general-input.component';

@customElement('password-input')
export class PasswordInput extends GeneralInput {
  constructor() {
    super();
    this.type = 'password';
  }

  _getValidationsErrors(value: string): string {
    const regExValidations = [/[a-z]+/, /[A-Z]+/, /[0-9]+/, /[$@#&!]+/];
    const strength = regExValidations.reduce(
      (acc, r) => acc + (r.test(value) ? 1 : 0),
      0,
    );

    if (value.length < 6) {
      return 'Password demasiado corta';
    }

    if (strength < regExValidations.length / 2) {
      return 'Password insegura';
    }

    return undefined;
  }
}
