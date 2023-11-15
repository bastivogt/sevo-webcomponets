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
            width: 100%;
            height: 100vh;
            z-index: 9999;
            background-color: rgba(0, 0, 0, .9);
            
        }







        #sevo-main-nav-content-container {
            position: relative;
            display: flex;
            justify-content: center;  
            align-items: center;
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

class SevoMainNav extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "closed" });
    this.root.appendChild(template.content.cloneNode(true));

    this.elements = {
      container: this.root.querySelector("#sevo-main-nav-container"),
      logo: this.root.querySelector("#sevo-main-nav-logo"),
      trigger: this.root.querySelector("#sevo-main-nav-trigger"),
      overlay: this.root.querySelector("#sevo-main-nav-overlay"),
      closeContainer: this.root.querySelector("#sevo-main-nav-close-container"),
      closeTrigger: this.root.querySelector("#sevo-main-nav-close-trigger"),
      overlayContent: this.root.querySelector("#sevo-main-nav-overlay-content"),
    };
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

  // barBackgroundColor
  get barBackgroundColor() {
    return this.getAttribute("bar-background-color");
  }
  set barBackgroundColor(value) {
    this.setAttribute("bar-background-color", value);
  }

  // barColor
  get barColor() {
    return this.getAttribute("bar-color");
  }
  set barColor(value) {
    this.setAttribute("bar-color", value);
  }

  // overlayBackgroundColor
  get overlayBackgroundColor() {
    return this.getAttribute("overlay-background-color");
  }
  set overlayBackgroundColor(value) {
    this.setAttribute("overlay-background-color", value);
  }

  // overlayColor
  get overlayColor() {
    return this.getAttribute("overlay-color");
  }
  set overlayColor(value) {
    this.setAttribute("overlay-color", value);
  }

  // connectedCallback
  connectedCallback() {
    // trigger
    this.elements.trigger.addEventListener("click", () => {
      console.log("SevoMainNav", "trigger clicked");
      /*       this.elements.overlay.classList.remove("display-none");
      document.body.style["overflow-y"] = "hidden"; */
      this.openOverlay();
    });

    // close-trigger
    this.elements.closeTrigger.addEventListener("click", () => {
      console.log("SevoMainNav", "closeTrigger clicked");
      //   this.elements.overlay.classList.add("display-none");
      //   document.body.style["overflow-y"] = "scroll";
      this.closeOverlay();
    });
  }

  // attributeChangedCallback
  attributeChangedCallback() {
    // bar-background-color
    if (this.barBackgroundColor) {
      this.elements.container.style["background-color"] =
        this.barBackgroundColor;
    }

    // bar-color
    if (this.barColor) {
      this.elements.container.style["color"] = this.barColor;
    }

    // overlay-background-color
    if (this.overlayBackgroundColor) {
      this.elements.overlay.style["background-color"] =
        this.overlayBackgroundColor;
    }

    // overlay-color
    if (this.overlayColor) {
      this.elements.overlay.style["color"] = this.overlayColor;
    }
  }

  // closeOverlay
  closeOverlay() {
    this.elements.overlay.classList.add("display-none");
    document.body.style["overflow-y"] = "scroll";
    this.dispatchEvent(new Event(SevoMainNav.events.OVERLAY_OPENED));
  }

  openOverlay() {
    this.elements.overlay.classList.remove("display-none");
    document.body.style["overflow-y"] = "hidden";
    this.dispatchEvent(new Event(SevoMainNav.events.OVERLAY_CLOSED));
  }
}

window.customElements.define("sevo-main-nav", SevoMainNav);
