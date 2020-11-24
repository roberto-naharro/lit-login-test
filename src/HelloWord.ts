import { LitElement, html, property, customElement } from 'lit-element';

@customElement('lit-login')
export class LitLogin extends LitElement {
  @property() name = 'World';

  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
