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

    this.root = this.attachShadow({ mode: "closed" });
    this.root.appendChild(template.content.cloneNode(true));

    this.elements = {
      columnsContainer: this.root.querySelector("#sevo-4-columns-container"),
    };
  }

  // observedAttributes
  static get observedAttributes() {
    return ["gap"];
  }

  // gap
  get gap() {
    return this.getAttribute("gap");
  }

  set gap(value) {
    this.setAttribute("gap", value);
  }

  //
  attributeChangedCallback(name, oldValue, newValue) {
    // gap
    if (this.gap) {
      this.elements.columnsContainer.style["gap"] = `${this.gap}`;
    }
  }
}

window.customElements.define("sevo-4-columns", Sevo4Columns);
