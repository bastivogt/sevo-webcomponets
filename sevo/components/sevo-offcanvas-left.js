"use strict";

const template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        * {
            box-sizing: border-box;
        }

        :host {
            --offcanvas-width: 500px;
            --animation-time: .5s;
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

        #offcanvas-content {
            padding: 10px 0 10px 0;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            height: 100%;

            overflow-y: auto;
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
            animation: slide-in-animation var(--animation-time) ease forwards;
        }

        #offcanvas.slide-closed {
            animation: slide-out-animation var(--animation-time) ease forwards;
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

        @media only screen and (max-width: 768px) {
            :host {
                --offcanvas-width: 500px;
            }
        }

        @media only screen and (max-width: 600px) {
            :host {
                --offcanvas-width: 300px;
            }
        }

        @media only screen and (max-width: 400px) {
            :host {
                --offcanvas-width: 200px;
            }
        }

    </style>
    <div part="container" id="offcanvas-container">
        <div part="offcanvas" id="offcanvas" class="opened">
            <div part="close" id="offcanvas-close"><slot name="close"><button>x</button></slot></div>
            <div part="content" id="offcanvas-content">
                <div part="inner" id="offcanvas-content-inner"><slot name="content"></slot></div>
            </div>
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
    this._backdropColor = "rgba(0, 0, 0, .4)";
    this._backgroundColor = "black";
    this._color = "white";
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

    // backdrop-close
    if (this._backdropClose) {
      this._elements.container.addEventListener("click", (evt) => {
        if (evt.target === this._elements.container) {
          this.open(false);
        }
      });
    }

    // backdrop-color
    if (this._backdropColor) {
      this._elements.container.style["background-color"] = this._backdropColor;
    }

    // background-color
    if (this._backgroundColor) {
      this._elements.offcanvas.style["background-color"] =
        this._backgroundColor;
    }

    // color
    if (this._color) {
      this._elements.offcanvas.style["color"] = this._color;
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
    return [
      "opened",
      "animated",
      "width",
      "backdrop-close",
      "backdrop-color",
      "background-color",
      "color",
    ];
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

    //backdrop-close
    if (name === "backdrop-close") {
      if (newValue === "true" || newValue === "") {
        this._backdropClose = true;
      } else {
        this._backdropClose = false;
      }
    }

    // backdrop-color
    if (name === "backdrop-color") {
      this._backdropColor = newValue;
      this._render();
    }

    // background-color
    if (name === "background-color") {
      this._backdropColor = newValue;
    }

    // color
    if (name === "color") {
      this._color = newValue;
    }
  }
}

customElements.define("sevo-offcanvas-left", SevoOffcanvasLeft);
