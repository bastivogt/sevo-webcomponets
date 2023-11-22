"use strict";

const template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        * {
            box-sizing: border-box;
        }
        :host {

        }
        #topbar-container {
            padding: 10px;

            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;


            box-shadow: 0px 4px 15px 0px rgba(0,0,0,0.2);
            position: sticky;
            top: 0;
            left: 0;
        }

        #content-left {
            background-color: orange;
        }

        #content-center {
            background-color: lime;
        }

        #content-right {
            background-color: skyblue;
        }



        
    </style>
    <div id="topbar-container">
        <div id="content-left"><slot name="left">Left</slot></div>
        <div id="content-center"><slot name="center">Center</slot></div>
        <div id="content-right"><slot name="right">Right</slot></div>
    </div>
`;

class SevoTopbar extends HTMLElement {
  constructor() {
    super();

    this._root = this.attachShadow({ mode: "closed" });
    this._root.appendChild(template.content.cloneNode(true));

    this._elements = {
      container: this._root.querySelector("#topbar-container"),
    };

    this._backgroundColor = "white";
    this._color = "black";
    this._padding = "10px";
  }

  // observedAttributes
  static get observedAttributes() {
    return ["backgound-color", "color", "padding"];
  }

  // attributeChangedCallback
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

    // padding
    if (name === "padding") {
      this._padding = newValue;
      this._render();
    }
  }

  // _render
  _render() {
    // background-color
    if (this._backgroundColor) {
      this._elements.container.style["background-color"] =
        this._backgroundColor;
    }

    // color
    if (this._color) {
      this._elements.container.style["color"] = this._color;
    }

    // padding
    if (this._padding) {
      this._elements.container.style["padding"] = this._padding;
    }
  }

  // connectedCallback
  connectedCalback() {
    this._render();
  }
}

customElements.define("sevo-topbar", SevoTopbar);
