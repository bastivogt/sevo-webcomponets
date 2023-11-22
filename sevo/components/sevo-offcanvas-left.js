"use strict";

const template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        * {
            box-sizing: border-box;
        }

        :host {
            --offcanvas-width: 350px;
        }
        #offcanvas-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, .6);
        }

        #offcanvas {
            background-color: black;
            /*width: 350px;*/
            width: var(--offcanvas-width);
            height: 100vh;
            padding: 10px;
            color: white;
            transition: all .5s ease;
        }

        #offcanvas-close {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
        }

        #offcanvas.opened {
            transform: translateX(0);
        }

        #offcanvas.closed {
            transform: translateX(-300px);
            /*transform: translateX(100 - var(--offcanvas-width));*/

        }

        #offcanvas.slide-opened {
            animation: slide-in-animation .5s ease forwards;
        }

        #offcanvas.slide-closed {
            animation: slide-out-animation .5s ease forwards;
        }

        @keyframes slide-in-animation {
            0% {
                transform: translateX(-350px);
            }
            100% {
                transform: translateX(0);
            }
        }

        @keyframes slide-out-animation {
            0% {
                transform: translateX(0);
            }
            100% {
                transform: translateX(-350px);
            }
        }



        .display-none {
            display: none !important;
        }

    </style>
    <div id="offcanvas-container">
        <div id="offcanvas" class="opened">
            <div id="offcanvas-close"><slot name="close"><button>x</button></slot></div>
           
        </div>    
    </div>
`;

export default class SevoOffcanvasLeft extends HTMLElement {
  constructor() {
    super();

    this._root = this.attachShadow({ mode: "closed" });
    this._root.appendChild(template.content.cloneNode(true));

    this._elements = {
      container: this._root.querySelector("#offcanvas-container"),
      offcanvas: this._root.querySelector("#offcanvas"),
      close: this._root.querySelector("#offcanvas-close"),
      closeSlot: this._root.querySelector("#offcanvas-close > slot"),
    };

    this._opened = false;
    this._width = "350px";
    this._animated = true;
  }

  // connectedCallback
  connectedCallback() {
    // close
    this._elements.closeSlot.addEventListener("click", () => {
      console.log("offcanvas closeslot clicked");
      this.setOpened(false);
    });
    this._render();
  }

  // _render
  _render() {
    console.log("_opened:", this._opened);
    // opened
    if (this._opened) {
      this.setOpened();
    } else {
      this.setOpened(false);
    }
  }

  // setOpened
  setOpened(flag = true) {
    if (this._animated) {
      if (flag) {
        this._elements.container.classList.remove("display-none");
        this._elements.offcanvas.classList.remove("slide-closed");
        this._elements.offcanvas.classList.add("slide-opened");
      } else {
        this._elements.offcanvas.classList.add("slide-closed");
        this._elements.offcanvas.classList.remove("slide-opened");

        this._elements.offcanvas.addEventListener("animationend", (evt) => {
          if (evt.animationName === "slide-out-animation") {
            this._elements.container.classList.add("display-none");
          }
        });
      }
    } else {
      if (flag) {
        this._elements.container.classList.remove("display-none");
        this._elements.offcanvas.classList.remove("closed");
        this._elements.offcanvas.classList.add("opened");
      } else {
        this._elements.container.classList.add("display-none");
        this._elements.offcanvas.classList.add("closed");
        this._elements.offcanvas.classList.remove("opened");
      }
    }
  }

  // observedAttributes
  static get observedAttributes() {
    return ["opened"];
  }

  // attributeChangedCallback
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
      this._render();
    }
  }
}

customElements.define("sevo-offcanvas-left", SevoOffcanvasLeft);
