"use strict";

const template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>

    * {
        box-sizing: border-box;
    }

    :host {
        --background-color: rgba(0, 0, 0, .9);
        --z-index: 999983;
        --color: white;
        --animation-time: .3s;
    }

    #backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        background-color: var(--background-color);

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        z-index: var(--z-index);
    }

    #close {
        position: absolute;
        top: 10px;
        right: 10px;
        color: var(--color);
    }

    #content {
        color: var(--color);
    }

    .hidden {
        display: none !important;
    }


    .fade-in {
        animation: fade-in-animation var(--animation-time) ease forwards;
    }

    .fade-out {
        animation: fade-out-animation var(--animation-time) ease forwards;
    }


    @keyframes fade-in-animation {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    @keyframes fade-out-animation {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }




    </style>
    
    <div id="backdrop">
        <div id="close"><slot name="close"><button>x</button></slot></div>
        <div id="content"><slot name="content"></slot></div>
    </div>
`;

export class SevoLightbox extends HTMLElement {
  constructor() {
    super();

    this._root = this.attachShadow({ mode: "closed" });
    this._root.appendChild(template.content.cloneNode(true));

    this._elements = {
      backdrop: this._root.querySelector("#backdrop"),
      slotClose: this._root.querySelector("slot[name='close'"),
      close: this._root.querySelector("#close"),
    };

    this._fadeInFinished = () => {};
    this._fadeOutFinished = () => {};
  }

  // Props
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

  // events
  static get events() {
    return {
      LIGHTBOX_OPENED: "light-box-opened",
      LIGHTBOX_CLOSED: "light-box-closed",
    };
  }

  // connectedCallback
  connectedCallback() {
    //this.close(false);
    this._render();

    // close
    this._elements.slotClose.addEventListener("click", () => {
      this.close(this.animated);
    });

    // fade
    this._elements.backdrop.addEventListener("animationend", (evt) => {
      if (evt.animationName === "fade-out-animation") {
        this._fadeOutFinished();
      }

      if (evt.animationName === "fade-in-animation") {
        this._fadeInFinished();
      }
    });
  }

  // observedAttributes
  static get observedAttributes() {
    return ["opened", "animated"];
  }

  // attributeChangedCallback
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    this._render();
  }

  // _render
  _render() {
    if (this.opened) {
      this.open(this.animated);
    } else {
      this.close(this.animated);
    }
  }

  // CSS vars
  _getCssVar(name) {
    const styles = getComputedStyle(this);
    return styles.getPropertyValue(name);
  }

  _setCssVar(name, value) {
    this.style.setProperty(name, value);
  }

  // open
  open(animated = true) {
    if (animated) {
      this._elements.backdrop.classList.remove("hidden");
      document.body.style["overflow-y"] = "hidden";
      this._elements.backdrop.classList.remove("fade-out");
      this._elements.backdrop.classList.add("fade-in");
      this._fadeInFinished = () => {
        this.opened = true;
        this.dispatchEvent(new Event(SevoLightbox.events.LIGHTBOX_OPENED));
      };

      //this.opened = true;
    } else {
      this._elements.backdrop.classList.remove("hidden");
      document.body.style["overflow-y"] = "hidden";
      console.log("open na");
      this.dispatchEvent(new Event(SevoLightbox.events.LIGHTBOX_OPENED));
      //this.opened = true;
    }
  }

  // close
  close(animated = true) {
    if (animated) {
      this._elements.backdrop.classList.remove("fade-in");
      this._elements.backdrop.classList.add("fade-out");
      document.body.style["overflow-y"] = "auto";

      this._fadeOutFinished = () => {
        this._elements.backdrop.classList.add("hidden");
        document.body.style["overflow-y"] = "auto";
        this.opened = false;
        this.dispatchEvent(new Event(SevoLightbox.events.LIGHTBOX_CLOSED));
      };
    } else {
      this._elements.backdrop.classList.add("hidden");
      document.body.style["overflow-y"] = "auto";
      this.dispatchEvent(new Event(SevoLightbox.events.LIGHTBOX_CLOSED));
      //this.opened = false;
    }
  }
}

customElements.define("sevo-lightbox", SevoLightbox);
