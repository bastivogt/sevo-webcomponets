"use strict";

const template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        * {
            box-sizing: border-box;
        }
        #sevo-content-box-container {

        }

        #sevo-content-box-inner {
            padding: 10px;
        }
    </style>
    <div part="container" id="sevo-content-box-container">
        <div part="inner" id="sevo-content-box-inner">
            <slot></slot>
        </div>
    </div>
`;

class SevoContentBox extends HTMLElement {
  constructor() {
    super();

    this._root = this.attachShadow({ mode: "closed" });
    this._root.appendChild(template.content.cloneNode(true));

    this._elements = {
      contentBoxContainer: this._root.querySelector(
        "#sevo-content-box-container"
      ),
      contentBoxInner: this._root.querySelector("#sevo-content-box-inner"),
    };

    this._backgroundColor = "transparent";
    this._color = null;
  }

  // connectedCallback
  connectedCallback() {
    this._render();
  }

  // _render
  _render() {
    // background-color
    if (this._backgroundColor) {
      this._elements.contentBoxContainer.style["background-color"] =
        this._backgroundColor;
    }

    // color
    if (this._color) {
      this._elements.contentBoxContainer.style["color"] = this._color;
    }
  }

  // observedAttributes
  static get observedAttributes() {
    return ["background-color", "color"];
  }

  // sttributesChanged
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    // background-color
    if (name === "background-color") {
      this._backgroundColor = newValue;
      this._render();
    }

    // color
    if (name === "color") {
      this._color = newValue;
      this._render();
    }
  }
}

window.customElements.define("sevo-content-box", SevoContentBox);
