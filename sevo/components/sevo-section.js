"use-strict";
/*
<sevo-section
    id="header-image"
    image-src="./images/bird-1045954_1920.jpg"
    content-horizontal="center"
    content-vertical="center"
    fixed="false"
    height="400px"
    color="red"
    background-color="green"
    >
        <h1 class="text-shadow">Eine Überschrift</h1>
</sevo-section>



*/

const template = document.createElement("template");
template.innerHTML = /*html*/ `
    <style>
        #sevo-section-container {
            display: flex;
            flex-direction: row;
            justify-content: center;

            background-position: 50% 50%;
            background-attachment: scroll;
            background-size: cover;

            
        }

        #sevo-section-inner {
            /*background-color: lightseagreen;*/
            padding: 75px 10px 75px 10px;
            max-width: 1100px;
            width: 100%;

            display: flex;
            /* justify-content: center;
            align-items: center; */

            justify-content: flex-start;
            align-items: flex-start;
        }
    </style>
    <section part="container" id="sevo-section-container">
        <div part="inner" id="sevo-section-inner">
            <div>
                <slot></slot>
            </div>
        </div
    </section>  
`;

class SevoSection extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: "closed" });
    this._root.appendChild(template.content.cloneNode(true));

    this._elements = {
      sectionContainer: this._root.querySelector("#sevo-section-container"),
      sectionInner: this._root.querySelector("#sevo-section-inner"),
    };

    // fields for the attributes
    this._imageSrc = null;
    this._contentHorizontal = "center";
    this._contentVertical = "center";
    this._backgroundColor = "transparent";
    this._color = null;
    this._height = null;
    this._fixed = "false";
  }

  // connectedCallback
  connectedCallback() {
    //console.log("CONNECTEDCALLBACK");
    this._render();
  }

  static get observedAttributes() {
    return [
      "image-src",
      "content-horizontal",
      "content-vertical",
      "background-color",
      "color",
      "fixed",
      "height",
    ];
  }

  // _render()
  _render() {
    // image-src
    if (this._imageSrc) {
      this._elements.sectionContainer.style[
        "background-image"
      ] = `url("${this._imageSrc}")`;
    }
    // background-color
    if (this._backgroundColor) {
      this._elements.sectionContainer.style["background-color"] =
        this._backgroundColor;
    }

    // color
    if (this._color) {
      this._elements.sectionContainer.style["color"] = this._color;
    }

    // fixed
    if (this._fixed === "true") {
      this._elements.sectionContainer.style["background-attachment"] = "fixed";
    } else {
      this._elements.sectionContainer.style["background-attachment"] = "scroll";
    }

    // height
    if (this._height) {
      this._elements.sectionContainer.style["height"] = `${this._height}`;
    }

    // content-horizontal
    if (this._contentHorizontal) {
      let value = "";
      switch (this._contentHorizontal) {
        case "start":
          value = "flex-start";
          break;
        case "center":
          value = "center";
          break;
        case "end":
          value = "flex-end";
          break;
        default:
          value = "flex-start";
      }
      this._elements.sectionInner.style["justify-content"] = value;
    }

    // content-vertical
    if (this._contentVertical) {
      let value = "";
      switch (this._contentVertical) {
        case "start":
          value = "flex-start";
          break;
        case "center":
          value = "center";
          break;
        case "end":
          value = "flex-end";
          break;
        default:
          value = "flex-start";
      }
      this._elements.sectionInner.style["align-items"] = value;
    }
  }

  // attributesChanged
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    // image-src
    if (name === "image-src") {
      this._imageSrc = newValue;
      this._render();
    }

    // background-color
    if (name === "background-color") {
      this._backgroundColor = newValue;
      this._render();
    }

    // color
    if (name === "color") {
      this._color = newValue;
      this._render();
    }

    // fixed
    if (name === "fixed") {
      if (newValue === "true" || newValue === "") {
        this._fixed = "true";
      } else {
        this._fixed = "false";
      }

      this._render();
    }

    // height
    if (name === "height") {
      this._height = newValue;
      this._render();
    }

    // content-horizontal
    if (name === "content-horizontal") {
      this._contentHorizontal = newValue;
      this._render();
    }

    // content-vertical
    if (name === "content-vertical") {
      this._contentVertical = newValue;
      this._render();
    }
  }
}

window.customElements.define("sevo-section", SevoSection);
