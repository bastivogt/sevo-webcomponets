"use strict";

const template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        * {
            box-sizing: border-box;
        }

        :host {
            --background-color: red;
        }

        #container {
            background-color: var(--background-color);
            width: 100px;
            height: 100px;
        }
    </style>
    <div id="container">
        <div id="inner">

        </div>
    </div>
`;

class ClassName extends HTMLElement {
  constructor() {
    super();

    this._root = this.attachShadow({ mode: "closed" });
    this._root.appendChild(template.content.cloneNode(true));

    this._elements = {};
  }

  // observedAttribute
  static get observedAttributes() {
    return ["opened", "background-color"];
  }

  // attributeChangedCallback
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    this._render();
  }

  // connectedCallback
  connectedCallback() {
    this._render();
  }

  // disconnectedCAllback
  disconnectedCallback() {}

  // Properties
  // opened
  get opened() {
    const value = this.getAttribute("opened");
    if (value === "true" || value === "") {
      return true;
    } else {
      return false;
    }
  }

  set opened(value) {
    if (value === true) {
      this.setAttribute("opened", "");
    } else {
      this.removeAttribute("opened");
    }
  }

  // background-color
  get backgroundColor() {
    return this.getAttribute("background-color");
  }

  set backgroundColor(value) {
    this.setAttribute("background-color", value);
  }

  // CSS vars
  _getCssVar(name) {
    const styles = getComputedStyle(this);
    return styles.getPropertyValue(name);
  }

  _setCssVar(name, value) {
    this.style.setProperty(name, value);
  }

  // _render
  _render() {
    // opened
    if (this.opened) {
    } else {
    }

    // background-color
    if (this.backgroundColor) {
      this._setCssVar("--background-color", this.backgroundColor);
    }
  }
}

customElements.define("class-name", ClassName);
