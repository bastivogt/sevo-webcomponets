"use-strict";
/*
<sevo-section
    id="header-image"
    image-src="./images/bird-1045954_1920.jpg"
    content-horizontal="center"
    content-vertical="center"
    fixed="false"
    height="400"
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

    this.root = this.attachShadow({ mode: "closed" });
    this.root.appendChild(template.content.cloneNode(true));

    this.elements = {
      sectionContainer: this.root.querySelector("#sevo-section-container"),
      sectionInner: this.root.querySelector("#sevo-section-inner"),
    };
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

  // image-src
  get imageSrc() {
    return this.getAttribute("image-src");
  }

  set imageSrc(value) {
    this.setAttribute("image-src", value);
  }

  // content-horizontal
  get contentHorizontal() {
    return this.getAttribute("content-horizontal");
  }

  set contentHorizontal(value) {
    this.setAttribute("content-horizontal", value);
  }

  // content-vertical
  get contentVertical() {
    return this.getAttribute("content-vertical");
  }

  set contentVertical(value) {
    this.setAttribute("content-vertical", value);
  }

  // background-color
  get backgroundColor() {
    return this.getAttribute("background-color");
  }

  set backgroundColor(value) {
    this.setAttribute("background-color", value);
  }

  // color
  get color() {
    return this.getAttribute("color");
  }

  set color(value) {
    return this.setAttribute("color", value);
  }

  // fixed
  get fixed() {
    const val = this.getAttribute("fixed");
    if (val === "true" || val === true) {
      return true;
    }
    return false;
  }

  set fixed(value) {
    this.setAttribute("fixed", value);
  }

  // height
  get height() {
    return this.getAttribute("height");
  }

  set height(value) {
    this.setAttribute("height", value);
  }

  connectedCallback() {
    // defaults
    /*     this.contentHorizontal = "start";
    this.contentVertical = "start";

    this.imageSrc = null; */
  }

  // sttributesChanged
  attributeChangedCallback(name, oldValue, newValue) {
    // imageSrc
    if (this.imageSrc) {
      //console.log("SevoSection", "imageSrc", this.imageSrc);
      this.elements.sectionContainer.style[
        "background-image"
      ] = `url("${this.imageSrc}")`;
    }

    // backgroundColor
    if (this.backgroundColor) {
      this.elements.sectionContainer.style["background-color"] =
        this.backgroundColor;
    }

    // color
    if (this.color) {
      this.elements.sectionContainer.style["color"] = this.color;
    }

    // fixed
    if (this.fixed) {
      this.elements.sectionContainer.style["background-attachment"] = "fixed";
    } else {
      this.elements.sectionContainer.style["background-attachment"] = "scroll";
    }

    // height
    if (this.height) {
      this.elements.sectionContainer.style["height"] = `${this.height}px`;
    }

    // contentHorizontal
    if (this.contentHorizontal) {
      let value = "";
      switch (this.contentHorizontal) {
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
      this.elements.sectionInner.style["justify-content"] = value;
    }

    // contentVertical
    if (this.contentVertical) {
      let value = "";
      switch (this.contentVertical) {
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
      this.elements.sectionInner.style["align-items"] = value;
    }
  }
}

window.customElements.define("sevo-section", SevoSection);
