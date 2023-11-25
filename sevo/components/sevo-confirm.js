"use strict";

const template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        * {
            box-sizing: border-box;
        }
        :host {
            --border-color: #ddd;
            --background-color: white;
            --backdrop-color: rgba(0, 0, 0, .5);
            --box-shadow: 0px 0px 20px 2px rgba(0,0,0,0.4);
            --border-radius: 6px;
            --animation-time: .3s;
            --slide-way: 400px;
            --footer-gap: 5px;
            --max-width-large: 75%;
            --max-width-medium: 90%;
            --max-width-small: 94%;
            --padding: 20px 10px;
            --z-index: 99999;

        }
        #header ::slotted(h1),
        #header ::slotted(h2),
        #header ::slotted(h3),
        #header ::slotted(h4),
        #header ::slotted(h5),
        #header ::slotted(h6),
        
        #content ::slotted(p)
        {
            margin: 0;
            padding: 0;
        }


        #backdrop {
            position: fixed;
            z-index: var(--z-index);
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background-color: var(--backdrop-color);

            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: flex-start;

            overflow-y: auto;

        }

        #confirm {
            margin-top: 100px;
            max-width: var(--max-width-large);
            width: 100%;
            background-color: var(--background-color);
            height: auto;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            border: 1px solid var(--border-color);
            
        }

        #header {
            padding: var(--padding);
            border-bottom: 1px solid var(--border-color);
        }

        #content {
            padding: var(--padding);
        }

        #footer {
            padding: var(--padding);
            border-top: 1px solid var(--border-color);

            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            gap: var(--footer-gap);
        }



        @keyframes slide-down-animation {
            0% {
                transform: translateY(calc(0px - var(--slide-way)));
            }
            100% {
                transform: translateY(0);
            }
        }

        @keyframes slide-up-animation {
            0% {
                transform: translateY(0);
            }
            100% {
                transform: translateY(calc(0px - var(--slide-way)));
            }
        }

        .slide-down {
            animation: slide-down-animation var(--animation-time) ease forwards;
        }

        .slide-up {
            animation: slide-up-animation var(--animation-time) ease forwards;
        }

        .hidden {
            display: none !important;
        }


        /* medium */
        @media only screen and (max-width: 768px) {
            #confirm {
                max-width: var(--max-width-medium);
            }
        }

        /* small */
        @media only screen and (max-width: 576px) {
            #confirm {
                max-width: var(--max-width-small);
                margin-top: 3%;
                margin-bottom: 3%;
            }
        }



    </style>
    <div id="backdrop">
        <section id="confirm">
            <header id="header"><slot name="header"><h2>Header</h2></slot></header>
            <main id="content"><slot name="content"></slot></main>
            <footer id="footer">
                <slot name="ok"></slot>
                <slot name="cancel"></slot>
            </footer>
        </section>
    </div>
`;

export default class SevoConfirm extends HTMLElement {
  constructor() {
    super();

    this._root = this.attachShadow({ mode: "open" });
    this._root.appendChild(template.content.cloneNode(true));

    this._elements = {
      backdrop: this._root.querySelector("#backdrop"),
      confirm: this._root.querySelector("#confirm"),
      header: this._root.querySelector("#header"),
      content: this._root.querySelector("#content"),
      footer: this._root.querySelector("#footer"),
      slotOK: this._root.querySelector("slot[name='ok']"),
      slotCancel: this._root.querySelector("slot[name='cancel']"),
    };
  }

  static get events() {
    return {
      CONFIRM_OK: "confirm-ok",
      CONFIRM_CANCEL: "confirm-cancel",
      CONFIRM_OPENED: "confirm-opened",
      CONFIRM_CLOSED: "confirm-closed",
    };
  }

  // opened
  get opened() {
    const value = this.getAttribute("opened");
    if (value === "true" || value === "") {
      return true;
    } else {
      return false;
    }
  }

  set opened(value) {
    if (value === true) {
      this.setAttribute("opened", "");
    } else {
      this.removeAttribute("opened");
    }
  }

  // animated
  get animated() {
    const value = this.getAttribute("animated");
    if (value === "true" || value === "") {
      return true;
    } else {
      return false;
    }
  }

  set animated(value) {
    if (value === true) {
      this.setAttribute("animated", "");
    } else {
      this.removeAttribute("animated");
    }
  }

  // backdrop-close
  get backdropClose() {
    const value = this.getAttribute("backdrop-close");
    if (value === "true" || value === "") {
      return true;
    } else {
      return false;
    }
  }

  set backdropClose(value) {
    if (value === true) {
      this.setAttribute("backdrop-close", "");
    } else {
      this.removeAttribute("backdrop-close");
    }
  }

  // backdrop-color
  get backdropColor() {
    return this.getAttribute("backdrop-color");
  }

  set backdropColor(value) {
    this.setAttribute("backdrop-color", value);
  }

  // animation-time
  get animationTime() {
    return this.getAttribute("animation-time");
  }

  set animationTime(value) {
    this.setAttribute("animatio-time");
  }

  // CSS vars
  _getCssVar(name) {
    const styles = getComputedStyle(this);
    return styles.getPropertyValue(name);
  }

  _setCssVar(name, value) {
    this.style.setProperty(name, value);
  }

  _render() {
    if (this.opened) {
      this.open(this.animated);
    } else {
      this.close(this.animated);
    }

    // backdrop-close
    if (this.backdropClose) {
      this._elements.backdrop.addEventListener("click", (evt) => {
        if (evt.target === this._elements.backdrop) {
          this.close(this.animated);
        }
      });
    }

    if (this.backdropColor) {
      this._setCssVar("--backdrop-color", this.backdropColor);
    }

    // animation-time
    if (this.animationTime) {
      this._setCssVar("--animation-time", this.animationTime);
    }
  }

  open(animated = true) {
    console.log("open animated", animated);
    if (animated) {
      this._elements.backdrop.classList.remove("hidden");
      this._elements.confirm.classList.remove("slide-up");
      document.body.style["overflow-y"] = "hidden";
      this._elements.confirm.classList.add("slide-down");
      this.dispatchEvent(new Event(SevoConfirm.events.CONFIRM_OPENED));
    } else {
      this._elements.backdrop.classList.remove("hidden");
      document.body.style["overflow-y"] = "hidden";
      this.dispatchEvent(new Event(SevoConfirm.events.CONFIRM_OPENED));
    }
  }

  close(animated = true) {
    if (animated) {
      this._elements.confirm.classList.remove("slide-down");
      this._elements.confirm.classList.add("slide-up");
      this._elements.confirm.addEventListener("animationend", (evt) => {
        if (evt.animationName === "slide-up-animation") {
          this._elements.backdrop.classList.add("hidden");
          document.body.style["overflow-y"] = "auto";
          this.dispatchEvent(new Event(SevoConfirm.events.CONFIRM_CLOSED));
        }
      });
    } else {
      this._elements.backdrop.classList.add("hidden");
      document.body.style["overflow-y"] = "auto";
      this.dispatchEvent(new Event(SevoConfirm.events.CONFIRM_CLOSED));
    }
  }

  // observedAttribute
  static get observedAttributes() {
    return [
      "opened",
      "animated",
      "backdrop-close",
      "backdrop-color",
      "animation-time",
    ];
  }

  // connectedCallback
  connectedCallback() {
    this.close(false);
    this._render();

    // buttons
    // ok
    this._elements.slotOK.addEventListener("click", () => {
      this.close(this.animated);
      this.dispatchEvent(new Event(SevoConfirm.events.CONFIRM_OK));
    });
    // cancel
    this._elements.slotCancel.addEventListener("click", () => {
      this.close(this.animated);
      this.dispatchEvent(new Event(SevoConfirm.events.CONFIRM_CANCEL));
    });
  }

  // attributeChangedCallback
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    this._render();

    // backdrop-color
    /*if (name === "backdrop-color") {
      //this.backdropColor = newValue;
      this._render();
    }*/

    // animation-time
    /*if (name === "animation-time") {
      //this.animationTime = newValue;
      this._render();
    }*/
  }
}

customElements.define("sevo-confirm", SevoConfirm);
