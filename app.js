"use strict";
import "./sevo/components/init.js";
import SevoMainNav from "./sevo/components/sevo-main-nav.js";

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
nav.addEventListener(SevoMainNav.events.OVERLAY_OPENED, (evt) => {
  console.log(SevoMainNav.events.OVERLAY_OPENED, evt);
});

nav.addEventListener(SevoMainNav.events.OVERLAY_CLOSED, (evt) => {
  console.log(SevoMainNav.events.OVERLAY_CLOSED, evt);
});
