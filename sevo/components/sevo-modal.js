"use strict";

const template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
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


            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-wrap: wrap;

        }

        #modal-header {
            padding: 10px;
        }

        #modal-main {
            padding: 10px;
        }

        #modal-footer {
            padding: 10px;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;

        }

        .fade-in {
            animation: fade-in-animation .5s ease forwards;
        }

        .fade-out {
            animation: fade-out-animation .5s ease forwards;
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
    <div id="modal-container">
        <div id="modal">
            <header id="modal-header"><slot name="title"></slot></header>
            <section id="modal-main">
                <slot name="content"></slot>
            </section>
            <footer id="modal-footer">
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
    };

    this._opened = false;
    this._backdropColor = "rgba(0, 0, 0, .6)";
    this._backdropClose = false;
    this._animated = false;
  }

  // observedAttributes
  static get observedAttributes() {
    return ["opened", "backdrop-color", "backdrop-close", "animated"];
  }

  _render() {
    // animated
    if (this._animated) {
      // opened
      if (this._opened) {
        this._elements.container.classList.remove("display-none");
        this._elements.container.classList.remove("fade-out");
        this._elements.container.classList.add("fade-in");
      } else {
        //this._elements.container.classList.add("display-none");
        this._elements.container.classList.remove("fade-in");
        this._elements.container.classList.add("fade-out");
        // animation
        this._elements.container.addEventListener("animationend", (evt) => {
          console.log("animationend");
          console.log(evt);
          if (evt.animationName === "fade-out-animation") {
            this._elements.container.classList.add("display-none");
          }
        });
      }
    } else {
      if (this._opened) {
        this._elements.container.classList.remove("display-none");
      } else {
        this._elements.container.classList.add("display-none");
      }
    }

    // backdrop-color
    if (this._backdropColor) {
      this._elements.container.style["background-color"] = this._backdropColor;
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
  }
}

customElements.define("sevo-modal", SevoModal);
