"use-strict";

const template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        #sevo-4-columns-container {
            display: flex;
            flex-direction: row;

        }

        .item {
            flex: 1;
  
        }


        @media only screen and (max-width: 992px) {
            #sevo-4-columns-container {
                flex-direction: column;
            }
        }


    </style>
    <div part="container" id="sevo-4-columns-container">
        <div part="item" id="sevo-4-colums-col-1" class="item">
            <slot name="column-1"></slot>
        </div>
        <div part="item" id="sevo-4-colums-col-2" class="item">
            <slot name="column-2"></slot>
        </div>
        <div part="item" id="sevo-4-colums-col-3" class="item">
            <slot name="column-3"></slot>
        </div>
        <div part="item" id="sevo-4-colums-col-4" class="item">
            <slot name="column-4"></slot>
        </div>
    </div>
`;

class Sevo4Columns extends HTMLElement {
  constructor() {
    super();

    this._root = this.attachShadow({ mode: "closed" });
    this._root.appendChild(template.content.cloneNode(true));

    this._elements = {
      columnsContainer: this._root.querySelector("#sevo-4-columns-container"),
    };

    this._gap = null;
  }

  // connectedCallback
  connectedCallback() {
    this._render();
  }

  // _render
  _render() {
    // gap
    if (this._gap) {
      this._elements.columnsContainer.style["gap"] = `${this._gap}`;
    }
  }

  // observedAttributes
  static get observedAttributes() {
    return ["gap"];
  }

  // attributesChanged
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    // gap
    if (name === "gap") {
      this._gap = newValue;
      this._render();
    }
  }
}

window.customElements.define("sevo-4-columns", Sevo4Columns);
