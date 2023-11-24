"use strict";
import "./sevo/components/init.js";
import SevoMainNav from "./sevo/components/sevo-main-nav.js";
import SevoModal from "./sevo/components/sevo-modal.js";
import SevoOffcanvasLeft from "./sevo/components/sevo-offcanvas-left.js";

import SevoConfirm from "./sevo/components/sevo-confirm.js";

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

modal.addEventListener("cancel", () => {
  console.log("modal cancel");
});

modal.addEventListener("ok", () => {
  console.log("modal OK");
});

// offcanvas-left
const openOffcanvasLeftBtn = document.querySelector("#open-offcanvas-left");
const offcanvasLeft = document.querySelector("sevo-offcanvas-left");
openOffcanvasLeftBtn.addEventListener("click", () => {
  offcanvasLeft.open();
});

// confirm
const openConfirmButton = document.querySelector("#open-confirm-button");
const myConfirm = document.querySelector("#my-confirm");
if (openConfirmButton) {
  openConfirmButton.addEventListener("click", () => {
    myConfirm.open(myConfirm.animated);
  });
}

if (myConfirm) {
  //myConfirm.backdropColor = "blue";
  myConfirm.addEventListener(SevoConfirm.events.CONFIRM_OPENED, () => {
    console.log(SevoConfirm.events.CONFIRM_OPENED);
  });

  myConfirm.addEventListener(SevoConfirm.events.CONFIRM_CLOSED, () => {
    console.log(SevoConfirm.events.CONFIRM_CLOSED);
  });

  myConfirm.addEventListener(SevoConfirm.events.CONFIRM_OK, () => {
    console.log(SevoConfirm.events.CONFIRM_OK);
  });

  myConfirm.addEventListener(SevoConfirm.events.CONFIRM_CANCEL, () => {
    console.log(SevoConfirm.events.CONFIRM_CANCEL);
  });
}
