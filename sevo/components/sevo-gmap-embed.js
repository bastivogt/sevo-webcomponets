"use strict";

const template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        #sevo-gmap-container {
          height: 200px;
            
        }

        ::slotted(iframe) {
          width: 100vw;
	        max-width: 100%;
          height: 200px;
        }
    </style>
    <div id="sevo-gmap-container">
        <slot></slot>
    </div>
`;

class SevoGMapEmbed extends HTMLElement {
  constructor() {
    super();

    this._root = this.attachShadow({ mode: "closed" });
    this._root.appendChild(template.content.cloneNode(true));

    this._elements = {
      container: this._root.querySelector("#sevo-gmap-container"),
      slot: this._root.querySelector("slot"),
    };

    this._height = null;
  }

  // connectedCallback
  connectedCallback() {
    this._render();
  }

  // observedAttributes
  static get observedAttributes() {
    return ["height"];
  }

  _render() {
    // height
    if (this._height) {
      this._elements.container.style["height"] = this._height;
      this._elements.slot.assignedNodes()[1].style["height"] = this._height;
    }
  }

  // attributeChangedCallback
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    // height
    if (name === "height") {
      this._height = newValue;
      this._render();
    }
  }
}

customElements.define("sevo-gmap-embed", SevoGMapEmbed);
