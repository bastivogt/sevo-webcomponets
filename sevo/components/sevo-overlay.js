"use-strict";

const template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>

    </style>
    <div id="sevo-overlay-trigger"><slot name="trigger"></slot></div>
    <div id="sevo-overlay"><slot name="content"></slot></div>  
`;

class SevoOverlay extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "closed" });
    this.root.appendChild(template.content.cloneNode(true));

    this.elements = {
      overlayTrigger: this.root.querySelector("#sevo-overlay-trigger"),
      overlay: this.querySelector("#sevo-overlay"),
    };
  }

  // observedAttributes
  get observedAttributes() {
    return [];
  }

  // connectedCallback
  connectedCallback() {
    // trigger
    this.elements.overlayTrigger.style["cursor"] = "pointer";
    this.elements.overlayTrigger.addEventListener("click", (evt) => {
      console.log("SevoOverlay", "trigger clicked");
    });
  }
}

window.customElements.define("sevo-overlay", SevoOverlay);
