"use strict";
import "./sevo/components/init.js";
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
