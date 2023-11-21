"use-strict";

const template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>

        * {
            box-sizing: border-box;
        }
        #sevo-main-nav-container {
            padding: 10px 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            
        }

        #sevo-main-nav-trigger {
            cursor: pointer;
        }

        #sevo-main-nav-overlay {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            /*width: 100%;
            height: 100vh;*/
            z-index: 9999;
            background-color: rgba(0, 0, 0, .9);
            /*overflow-y: auto;*/
            
        }

        #sevo-main-nav-content-container {
            position: relative;
            display: flex;
            justify-content: center;  
            align-items: center;
            flex-wrap:wrap;
            /*background-color: red;*/
            height: 100%;
            overflow-y: auto;
            padding: 10px;
        }

        #sevo-main-nav-close-trigger {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
        }

        #sevo-main-nav-overlay-content {
            

        }

        .display-none {
            display: none !important;
        }
    </style>
    <section part="bar-container" id="sevo-main-nav-container">
        <div part="bar-logo" id="sevo-main-nav-logo"><slot name="logo"></slot></div>
        <div part="bar-open-trigger" id="sevo-main-nav-trigger"><slot name="trigger"></slot></div>
    </section>
    <section part="overlay" id="sevo-main-nav-overlay" class="display-none">
        
        <div part="overlay-content-container" id="sevo-main-nav-content-container">
            <div part="close-trigger" id="sevo-main-nav-close-trigger"><slot name="close-trigger"></slot></div>
            <div part="overlay-content" id="sevo-main-nav-overlay-content"><slot name="content"></slot></div>
        </div>
    </section>
`;

export default class SevoMainNav extends HTMLElement {
  constructor() {
    super();

    this._root = this.attachShadow({ mode: "closed" });
    this._root.appendChild(template.content.cloneNode(true));

    this._elements = {
      container: this._root.querySelector("#sevo-main-nav-container"),
      logo: this._root.querySelector("#sevo-main-nav-logo"),
      trigger: this._root.querySelector("#sevo-main-nav-trigger"),
      overlay: this._root.querySelector("#sevo-main-nav-overlay"),
      closeContainer: this._root.querySelector(
        "#sevo-main-nav-close-container"
      ),
      closeTrigger: this._root.querySelector("#sevo-main-nav-close-trigger"),
      overlayContent: this._root.querySelector(
        "#sevo-main-nav-overlay-content"
      ),
    };

    this._barBackgroundColor = "black";
    this._barColor = "white";
    this._overlayBackgroundColor = "rgba(0, 0, 0, .7)";
    this._overlayColor = "white";
  }

  // _render
  _render() {
    // bar-background-color
    if (this._barBackgroundColor) {
      this._elements.container.style["background-color"] =
        this._barBackgroundColor;
    }

    // bar-color
    if (this._barColor) {
      this._elements.container.style["color"] = this._barColor;
    }

    // overlay-background-color
    if (this._overlayBackgroundColor) {
      this._elements.overlay.style["background-color"] =
        this._overlayBackgroundColor;
    }

    // overlay-color
    if (this._overlayColor) {
      this._elements.overlay.style["color"] = this._overlayColor;
    }
  }

  static get events() {
    return {
      OVERLAY_OPENED: "overlay-opened",
      OVERLAY_CLOSED: "overlay-closed",
    };
  }

  // observedAttributes
  static get observedAttributes() {
    return [
      "bar-background-color",
      "bar-color",
      "overlay-background-color",
      "overlay-color",
    ];
  }

  // connectedCallback
  connectedCallback() {
    this._render();
    // trigger
    this._elements.trigger.addEventListener("click", () => {
      this.openOverlay();
    });

    // close-trigger
    this._elements.closeTrigger.addEventListener("click", () => {
      this.closeOverlay();
    });
  }

  // attributeChangedCallback
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    // bar-background-color
    if (name === "bar-background-color") {
      this._barBackgroundColor = newValue;
      this._render();
    }

    // bar-color
    if (name === "bar-color") {
      this._barColor = newValue;
      this._render();
    }

    // overlay-background-color
    if (name === "overlay-background-color") {
      this._overlayBackgroundColor = newValue;
      this._render();
    }

    // overlay-color
    if (name === "overlay-color") {
      this._overlayColor = newValue;
      this._render();
    }

    // bar-background-color
    /*     if (this.barBackgroundColor) {
      this.elements.container.style["background-color"] =
        this.barBackgroundColor;
    } */

    // bar-color
    /*     if (this.barColor) {
      this.elements.container.style["color"] = this.barColor;
    } */

    // overlay-background-color
    /*     if (this.overlayBackgroundColor) {
      this.elements.overlay.style["background-color"] =
        this.overlayBackgroundColor;
    } */

    // overlay-color
    /*     if (this.overlayColor) {
      this.elements.overlay.style["color"] = this.overlayColor;
    } */
  }

  // closeOverlay
  closeOverlay() {
    this._elements.overlay.classList.add("display-none");
    document.body.style["overflow-y"] = "auto";
    this.dispatchEvent(new Event(SevoMainNav.events.OVERLAY_CLOSED));
  }

  openOverlay() {
    this._elements.overlay.classList.remove("display-none");
    document.body.style["overflow-y"] = "hidden";
    this.dispatchEvent(new Event(SevoMainNav.events.OVERLAY_OPENED));
  }
}

window.customElements.define("sevo-main-nav", SevoMainNav);
