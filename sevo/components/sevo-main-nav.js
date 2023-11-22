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
    this._animated = false;
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
      "animated",
    ];
  }

  // connectedCallback
  connectedCallback() {
    console.log("animated", this._animated);
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

    // animated
    if (name === "animated") {
      if (newValue === "true" || newValue === "") {
        this._animated = true;
      } else {
        this._animated = false;
      }
    }
  }

  // closeOverlay
  closeOverlay() {
    if (this._animated) {
      this._elements.overlay.classList.remove("fade-in");
      this._elements.overlay.classList.add("fade-out");
      //this._elements.overlay.classList.add("display-none");
      document.body.style["overflow-y"] = "auto";
      this._elements.overlay.addEventListener("animationend", (evt) => {
        if (evt.animationName === "fade-out-animation") {
          this._elements.overlay.classList.add("display-none");
        }
      });
      this.dispatchEvent(new Event(SevoMainNav.events.OVERLAY_CLOSED));
    } else {
      this._elements.overlay.classList.add("display-none");
      document.body.style["overflow-y"] = "auto";
      this.dispatchEvent(new Event(SevoMainNav.events.OVERLAY_CLOSED));
    }
  }

  openOverlay() {
    if (this._animated) {
      this._elements.overlay.classList.remove("display-none");
      document.body.style["overflow-y"] = "hidden";
      this._elements.overlay.classList.remove("fade-out");
      this._elements.overlay.classList.add("fade-in");
      this.dispatchEvent(new Event(SevoMainNav.events.OVERLAY_OPENED));
    } else {
      this._elements.overlay.classList.remove("display-none");
      document.body.style["overflow-y"] = "hidden";
      this.dispatchEvent(new Event(SevoMainNav.events.OVERLAY_OPENED));
    }
  }
}

window.customElements.define("sevo-main-nav", SevoMainNav);
