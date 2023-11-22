"use strict";

const template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        * {
            box-sizing: border-box;
        }

        :host {
            --animation-speed: .5s;
        }

        #modal-container {
            position: fixed;
            z-index: 9999;
            background-color: rgba(0, 0, 0, .7);
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            overflow-y: auto;
        }

        #modal {
            background-color: white;
            width: 75%;


            /*display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-wrap: wrap;*/
            /*border-radius: 4px;*/
            border: 1px solid #eee;

        }

        #modal-header {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }

        #modal-main {
            padding: 10px;
        }

        #modal-footer {
            padding: 20px 10px;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            border-top: 1px solid #eee;

        }

        .fade-in {
            animation: fade-in-animation var(--animation-speed) ease forwards;
        }

        .fade-out {
            animation: fade-out-animation var(--animation-speed) ease forwards;
        }


        @media only screen and (max-width: 768px) {
            #modal {
                width: 90%;
            }
        }

        @keyframes fade-in-animation{
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1
            }
        }

        @keyframes fade-out-animation{
            0% {
                opacity: 1;
            }
            100% {
                opacity: 0
            }
        }

        .display-none {
            display: none !important;
        }
    </style>
    <div part="container" id="modal-container">
        <div part="modal" id="modal">
            <header part="modal-header" id="modal-header"><slot name="title"></slot></header>
            <section part="modal-content" id="modal-main">
                <slot name="content"></slot>
            </section>
            <footer part="modal-footer" id="modal-footer">
                <slot name="close">
                    <button>Close</button>
                </slot>
                
            </footer>
        </div>
    </div>  
`;

export default class SevoModal extends HTMLElement {
  constructor() {
    super();

    this._root = this.attachShadow({ mode: "closed" });
    this._root.appendChild(template.content.cloneNode(true));

    this._elements = {
      container: this._root.querySelector("#modal-container"),
      slotClose: this._root.querySelector("slot[name='close']"),
      modal: this._root.querySelector("#modal"),
      modalHeader: this._root.querySelector("#modal-header"),
      modalFooter: this._root.querySelector("#modal-footer"),
    };

    this._opened = false;
    this._backdropColor = "rgba(0, 0, 0, .6)";
    this._backdropClose = false;
    this._animated = false;
    this._borderColor = "#eee";
    this._zIndex = "9999";
    this._borderRadius = "3px";
  }

  // observedAttributes
  static get observedAttributes() {
    return [
      "opened",
      "backdrop-color",
      "backdrop-close",
      "animated",
      "border-color",
      "z-index",
      "border-radius",
    ];
  }

  _render() {
    // animated
    if (this._animated) {
      // opened
      if (this._opened) {
        this._elements.container.classList.remove("display-none");
        this._elements.container.classList.remove("fade-out");
        this._elements.container.classList.add("fade-in");
        document.body.style["overflow-y"] = "hidden";
      } else {
        //this._elements.container.classList.add("display-none");
        this._elements.container.classList.remove("fade-in");
        this._elements.container.classList.add("fade-out");
        document.body.style["overflow-y"] = "auto";
        // animationend event
        this._elements.container.addEventListener("animationend", (evt) => {
          //console.log("animationend");
          //console.log(evt);
          if (evt.animationName === "fade-out-animation") {
            this._elements.container.classList.add("display-none");
          }
        });
      }
    } else {
      if (this._opened) {
        this._elements.container.classList.remove("display-none");
        document.body.style["overflow-y"] = "hidden";
      } else {
        this._elements.container.classList.add("display-none");
        document.body.style["overflow-y"] = "auto";
      }
    }

    // backdrop-color
    if (this._backdropColor) {
      this._elements.container.style["background-color"] = this._backdropColor;
    }

    // border-color
    if (this._borderColor) {
      this._elements.modal.style["border"] = `1px solid ${this._borderColor}`;
      this._elements.modalHeader.style[
        "border-bottom"
      ] = `1px solid ${this._borderColor}`;
      this._elements.modalFooter.style[
        "border-top"
      ] = `1px solid ${this._borderColor}`;
    }

    // z-index
    if (this._zIndex) {
      this._elements.container.style["z-index"] = this._zIndex;
    }

    // border-radius
    if (this._borderRadius) {
      this._elements.modal.style["border-radius"] = this._borderRadius;
    }
  }

  setOpened(flag = true) {
    if (flag) {
      this.setAttribute("opened", "");
    } else {
      this.removeAttribute("opened");
    }
  }

  // connectedCallback
  connectedCallback() {
    this._render();

    // close
    this._elements.slotClose.addEventListener("click", () => {
      this.setOpened(false);
    });

    this._elements.container.addEventListener("click", () => {
      if (this._backdropClose) {
        this.setOpened(false);
      }
    });
  }

  // attributeChanged
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    // opened
    if (name === "opened") {
      if (newValue === "true" || newValue === "") {
        this._opened = true;
      } else {
        this._opened = false;
      }
      console.log(this._opened);
      this._render();
    }

    // animated
    if (name === "animated") {
      if (newValue === "true" || newValue === "") {
        this._animated = true;
      } else {
        this._animated = false;
      }
      this._render();
    }

    // backdrop-color
    if (name === "backdrop-color") {
      this._backdropColor = newValue;
      this._render();
    }

    // border-color
    if (name === "border-color") {
      this._borderColor = newValue;
      this._render;
    }

    // z-index
    if (name === "z-index") {
      this._zIndex = newValue;
      this._render();
    }

    // border-radius
    if (name === "border-radius") {
      this._borderRadius = newValue;
      this._render();
    }
  }
}

customElements.define("sevo-modal", SevoModal);
