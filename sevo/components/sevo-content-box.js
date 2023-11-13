"use strict";

const template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
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

    this.root = this.attachShadow({ mode: "closed" });
    this.root.appendChild(template.content.cloneNode(true));

    this.elements = {
      contentBoxContainer: this.root.querySelector(
        "#sevo-content-box-container"
      ),
      contentBoxInner: this.root.querySelector("#sevo-content-box-inner"),
    };
  }

  // observedAttributes
  static get observedAttributes() {
    return ["background-color", "color"];
  }

  // backgroundColor
  get backgroundColor() {
    return this.getAttribute("background-color");
  }

  set backgroundColor(value) {
    this.setAttribute("background-color", value);
  }

  // color
  get color() {
    return this.getAttribute("color");
  }

  set color(value) {
    this.setAttribute("color", value);
  }

  // sttributesChanged
  attributeChangedCallback(name, oldValue, newValue) {
    // background-color
    if (this.backgroundColor) {
      this.elements.contentBoxContainer.style["background-color"] =
        this.backgroundColor;
    }

    // color
    if (this.color) {
      this.elements.contentBoxContainer.style["color"] = this.color;
    }
  }
}

window.customElements.define("sevo-content-box", SevoContentBox);
