"use strict";

console.log("index2.js");

const mainMenuOffcanvas = document.querySelector("#main-menu-offcanvas");
const mainMenuOpenTrigger = document.querySelector("#main-menu-open-trigger");

mainMenuOpenTrigger.addEventListener("click", (evt) => {
  mainMenuOffcanvas.open(true);
});
