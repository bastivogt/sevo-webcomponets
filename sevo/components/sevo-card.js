"use strict";

const template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        * {
            box-sizing: border-box;
        }
        #sevo-card-container {
            box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.4);
            margin: 20px;
        }

        #sevo-card-header {
            padding: 10px 20px;
            background-color: rgb(245, 245, 245);
            
        }

        #sevo-card-body {
            padding: 10px 20px;
        }

        #sevo-card-footer {
            padding: 10px 20px;
            border-top: 1px solid rgb(240, 240, 240)
        }

        #sevo-card-image img {
            width: 100px;
            height: 100px;
        }

        ::slotted(img) {
          width: 100%;
        }

    </style>
    <div id="sevo-card-container">
        <div part="header" id="sevo-card-header"><slot name="header"></slot></div>
        <div part="image" id="sevo-card-image"><slot name="image"></slot></div>
        <div part="body" id="sevo-card-body"><slot name="body"></slot></div>
        <div part="footer" id="sevo-card-footer"><slot name="footer"></slot></div>
    </div>
`;

class SevoCard extends HTMLElement {
  constructor() {
    super();

    this._root = this.attachShadow({ mode: "closed" });
    this._root.appendChild(template.content.cloneNode(true));

    this._elements = {
      cardContainer: this._root.querySelector("#sevo-card-container"),
      cardHeader: this._root.querySelector("#sevo-card-header"),
      cardHeaderSlot: this._root.querySelector("#sevo-card-header > slot"),
      cardImage: this._root.querySelector("#sevo-card-image"),
      cardImageSlot: this._root.querySelector("#sevo-card-image > slot"),
      cardBody: this._root.querySelector("#sevo-card-body"),
      cardFooter: this._root.querySelector("#sevo-card-footer"),
      cardFooterSlot: this._root.querySelector("#sevo-card-footer > slot"),
    };

    // fields for atrributes
    this._bodyMinHeight = null;
  }

  _render() {
    if (this._elements.cardFooterSlot.assignedNodes().length === 0) {
      this._elements.cardFooter.style["display"] = "none";
    }
    if (this._elements.cardHeaderSlot.assignedNodes().length === 0) {
      this._elements.cardHeader.style["display"] = "none";
    }
    if (this._elements.cardImageSlot.assignedNodes().length === 0) {
      this._elements.cardImage.style["display"] = "none";
    }

    // body-min-height
    if (this._bodyMinHeight) {
      this._elements.cardBody.style["min-height"] = `${this._bodyMinHeight}`;
    }
  }

  // observedAttributes
  static get observedAttributes() {
    return ["body-min-height"];
  }

  // bodyMinHeight
  get bodyMinHeight() {
    return this.getAttribute("body-min-height");
  }

  set bodyMinHeight(value) {
    this.setAttribute("body-min-height", value);
  }

  connectedCallback() {
    // console.log("CARD conennected callback");
    // console.log(this.elements.cardFooterSlot.assignedNodes());
    this._render();
  }

  // attributeChangedCallback
  attributeChangedCallback(name, oldValue, newValue) {
    // body-min-height
    if (this.bodyMinHeight) {
      this._elements.cardBody.style["min-height"] = `${this.bodyMinHeight}`;
    }
  }
}

window.customElements.define("sevo-card", SevoCard);
