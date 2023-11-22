"use strict";

const template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        * {
            box-sizing: border-box;
        }

        :host {
            --offcanvas-width: 500px;
            --animation-speed: .5s;
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
            transform: translateX(-350px);
            /*transform: translateX(100 - var(--offcanvas-width));*/

        }

        #offcanvas.slide-opened {
            animation: slide-in-animation var(--animation-speed) ease forwards;
        }

        #offcanvas.slide-closed {
            animation: slide-out-animation var(--animation-speed) ease forwards;
        }

        @keyframes slide-in-animation {
            0% {
                /*transform: translateX(-350px);*/
                transform: translateX(calc(0px - var(--offcanvas-width)));
                /*transform: translateX(calc(0 - var(--offcanvas-width)));*/
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
                /*transform: translateX(-350px);*/
                transform: translateX(calc(0px - var(--offcanvas-width)));
                /*transform: translateX(calc(0 - var(--offcanvas-width)));*/
            }
        }



        .display-none {
            display: none !important;
        }

        @media only screen and (max-width: 600px) {
            :host {
                --offcanvas-width: 300px;
            }
        }

        @media only screen and (max-width: 350px) {
            :host {
                --offcanvas-width: 200px;
            }
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

    //this._root = this.attachShadow({ mode: "closed" });
    //this._createInnerHTML();

    this._elements = {
      container: this._root.querySelector("#offcanvas-container"),
      offcanvas: this._root.querySelector("#offcanvas"),
      close: this._root.querySelector("#offcanvas-close"),
      closeSlot: this._root.querySelector("#offcanvas-close > slot"),
    };

    this._opened = false;
    this._animated = false;
    this._backdropClose = false;
  }

  // connectedCallback
  connectedCallback() {
    // close
    this._elements.closeSlot.addEventListener("click", () => {
      console.log("offcanvas closeslot clicked");
      this.open(false);
    });
    this._setOpened(false, false);
    this._render();
  }

  // _render
  _render() {
    console.log("offcanvas, animated:", this._animated);
    // opened
    if (this._opened) {
      this._setOpened(true, this._animated);
    } else {
      this._setOpened(false, this._animated);
    }
  }

  // setOpened
  _setOpened(flag = true, animated = true) {
    if (animated) {
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

  open(flag = true) {
    this._setOpened(flag, this._animated);
  }
  // observedAttributes
  static get observedAttributes() {
    return ["opened", "animated", "width", "backdrop-close"];
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

    // animated
    if (name === "animated") {
      if (newValue === "true" || newValue === "") {
        this._animated = true;
      } else {
        this._animated = false;
      }
      this._render();
    }
  }
}

customElements.define("sevo-offcanvas-left", SevoOffcanvasLeft);
