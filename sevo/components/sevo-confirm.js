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

    this._opened = null;
    this._animated = null;
    this._backdropClose = null;
    this._backdropColor = null;
    this._backgroundColor = null;

    this._animationendFlag = false;
  }

  static get events() {
    return {
      CONFIRM_OK: "confirm-ok",
      CONFIRM_CANCEL: "confirm-cancel",
      CONFIRM_OPENED: "confirm-opened",
      CONFIRM_CLOSED: "confirm-closed",
    };
  }

  // CSS vars
  _getCssVar(name) {
    const styles = getComputedStyle(this);
    return styles.getPropertyValue(name);
  }

  _setCssVar(name, value) {
    this.style.setProperty(name, value);
  }

  _render() {}

  open(animated = true) {
    if (animated) {
      console.log("open a", animated);
      console.log(this._animated);
      this._elements.backdrop.classList.remove("hidden");
      this._elements.confirm.classList.remove("slide-up");
      document.body.style["overflow-y"] = "hidden";
      this._elements.confirm.classList.add("slide-down");
      this.dispatchEvent(new Event(SevoConfirm.events.CONFIRM_OPENED));
      //this.opened = true;
    } else {
      console.log("open b", animated);
      console.log(this._animated);
      this._elements.backdrop.classList.remove("hidden");
      document.body.style["overflow-y"] = "hidden";
      //this.opened = true;
      this.setAttribute("opened", "");
      console.log("open bbbccc");
      this.dispatchEvent(new Event(SevoConfirm.events.CONFIRM_OPENED));
    }
  }

  close(animated = true) {
    if (animated) {
      this._elements.confirm.classList.remove("slide-down");
      this._elements.confirm.classList.add("slide-up");
      this.dispatchEvent(new Event(SevoConfirm.events.CONFIRM_CLOSED));
    } else {
      this._elements.backdrop.classList.add("hidden");
      document.body.style["overflow-y"] = "auto";
      //this.opened = false;
      this.removeAttribute("opened");
      console.log("close aaaccc");
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
    //this._render();

    // animationend
    this._elements.confirm.addEventListener(
      "animationend",
      this._animationEndHandler.bind(this)
    );

    // buttons
    // ok
    this._elements.slotOK.addEventListener(
      "click",
      this._slotOKHandler.bind(this)
    );
    // cancel
    this._elements.slotCancel.addEventListener(
      "click",
      this._slotCancelHandler.bind(this)
    );

    if (this._backdropClose) {
      this._elements.backdrop.addEventListener(
        "click",
        this._backdropCloseHandler.bind(this)
      );
    }
  }

  disconnectedCallback() {
    this._elements.confirm.removeEventListener(
      "animationend",
      this._animationEndHandler
    );
    this._elements.slotOK.removeEventListener("click", this._slotOKHandler);
    this._elements.slotCancel.removeEventListener(
      "click",
      this._slotCancelHandler
    );
    this._elements._backdropClose.removeEventListener(
      "click",
      this._backdropCloseHandler
    );
  }

  // Handler
  _animationEndHandler(evt) {
    console.log(evt);
    if (evt.animationName === "slide-up-animation") {
      this._elements.backdrop.classList.add("hidden");
      document.body.style["overflow-y"] = "auto";
      //this.opened = false;
      this.removeAttribute("opened");
    }
  }

  _slotOKHandler(evt) {
    this.close(this.animated);
    this.dispatchEvent(new Event(SevoConfirm.events.CONFIRM_OK));
  }

  _slotCancelHandler(evt) {
    this.close(this.animated);
    this.dispatchEvent(new Event(SevoConfirm.events.CONFIRM_CANCEL));
  }

  _backdropCloseHandler(evt) {
    if (evt.target === this._elements.backdrop) {
      this.close(this._animated);
    }
  }

  // attributeChangedCallback
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    // animated
    if (name === "animated") {
      if (newValue === "true" || newValue === "") {
        this._animated = true;
      } else {
        this._animated = false;
      }
      //this._render();
    }

    // opened
    if (name === "opened") {
      if (newValue === "true" || newValue === "") {
        //this._opened = true;
        console.log("attr", this._animated);
        this.open(this._animated);
      } else {
        this.close(this._animated);
        //this._opened = false;
      }
      //this._render();
    }

    // backdrop-close
    if (name === "backdrop-close") {
      if (newValue === "true" || newValue === "") {
        this._backdropClose = true;
      } else {
        this._backdropClose = false;
      }
      //this._render();
    }

    // backdrop-color
    if (name === "backdrop-color") {
      this._backdropColor = newValue;
      this._setCssVar("--backdrop-color", this._backdropColor);
    }
  }
}

customElements.define("sevo-confirm", SevoConfirm);
