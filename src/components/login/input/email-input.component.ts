import { customElement } from 'lit-element';

import { GeneralInput } from './general-input.component';

@customElement('email-input')
export class EmailInput extends GeneralInput {
  constructor() {
    super();
    this.type = 'email';
  }

  _getValidationsErrors(value: string): string {
    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? 'Email no válido'
      : undefined;
  }
}
