"use strict";
import "./sevo/components/init.js";
import SevoMainNav from "./sevo/components/sevo-main-nav.js";
import SevoModal from "./sevo/components/sevo-modal.js";
import SevoOffcanvasLeft from "./sevo/components/sevo-offcanvas-left.js";

console.log("app.js");

const headerImage = document.getElementById("header-image");

let fixed = true;
document.addEventListener("click", () => {
  console.log("fixed", headerImage.getAttribute("fixed"));
  //headerImage.setAttribute("content-horizontal", "start");
  fixed = !fixed;
  //headerImage.setAttribute("fixed", fixed);
});

document.body.addEventListener("body animationend", () => {
  console.log("animationend");
  document.body.style["transform"] = "";
});

const nav = document.querySelector("sevo-main-nav");
if (nav) {
  nav.addEventListener(SevoMainNav.events.OVERLAY_OPENED, (evt) => {
    console.log(SevoMainNav.events.OVERLAY_OPENED, evt);
  });

  nav.addEventListener(SevoMainNav.events.OVERLAY_CLOSED, (evt) => {
    console.log(SevoMainNav.events.OVERLAY_CLOSED, evt);
  });
}

// Modal
const openModalBtn = document.querySelector("#open-modal");
const modal = document.querySelector("sevo-modal");
openModalBtn.addEventListener("click", () => {
  modal.setOpened();
});

// offcanvas-left
const openOffcanvasLeftBtn = document.querySelector("#open-offcanvas-left");
const offcanvasLeft = document.querySelector("sevo-offcanvas-left");
openOffcanvasLeftBtn.addEventListener("click", () => {
  offcanvasLeft.open();
});
