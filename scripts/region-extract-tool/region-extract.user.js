// ==UserScript==
// @name        Region Extract Tool
// @namespace   https://rr-tools.eu/
// @match       *://rivalregions.com/*
// @match       *://rr-tools.eu/*
// @author      Pablo
// @description
// @grant GM_setValue
// @grant GM_getValue
// @version     0.5.1
// @downloadURL https://github.com/pbl0/rr-scripts/raw/main/scripts/region-extract-tool/region-extract.user.js
// ==/UserScript==

/**
 *  IMPORTANT: ONLY WORKS ON ENGLISH INTERFACE OF RIVALREGIONS
 */

/**
 * v0.5 - fix on button inside rr-tools.eu, remove jQuery
 * v0.5.1 - fixes a bug with regions in energy insolvent states that didn't allow to be extracted. (By @bagd1k)
 */

listener();
function listener() {
  if (location.href.includes("#map/details/")) {
    regionPage();
  } else if (location.href.includes("/region-cost")) {
    calcPage();
  }
}

function didntLoad(count, interval) {
  count++;
  if (count >= 10) {
    clearInterval(interval);
    console.log("dint load");
    return true;
  }
}

function regionPage() {
  let count = 0;
  const loadInterval = setInterval(() => {
    if (document.querySelectorAll("div.small.imp.tc>span").length) {
      clearInterval(loadInterval);
      document
        .querySelector(".imp.tc.small")
        .insertAdjacentHTML(
          "beforeend",
          `<span class=""><button id="my-extract-button">Extract</button></span>`
        );

      document
        .getElementById("my-extract-button")
        .addEventListener("click", function () {
          extractRegion();
        });
    }
    didntLoad(count, loadInterval);
  }, 500);
}

function calcPage() {
  const loadInterval = setInterval(() => {
    let count = 0;
    const region = GM_getValue("my-region");
    if (document.querySelectorAll("app-buildings").length) {
      clearInterval(loadInterval);
      document
        .querySelector("app-buildings")
        .insertAdjacentHTML(
          "beforeend",
          `<a id="my-load-button" class="pt-3 button is-primary">${region.regionName}</a>`
        );
      document
        .getElementById("my-load-button")
        .addEventListener("click", function () {
          const regionCostModelo = JSON.parse(
            localStorage.getItem("regionCostModelo")
          );
          regionCostModelo.buildings = region.buildings;

          localStorage.setItem(
            "regionCostModelo",
            JSON.stringify(regionCostModelo)
          );

          location.reload();
        });
    }
    didntLoad(count, loadInterval);
  }, 500);
}

function extractRegion() {
  const buildingsHtml = document.querySelectorAll(
    "div.imp.tc.small>span.tip.white.pointer.dot.small"
  );

  const myRegion = new Region();

  buildingsHtml.forEach(function (building) {
    const nameAndAmount = building.textContent.split(":");
    const name = nameAndAmount[0].trim();
    const preAmount = nameAndAmount[1].trim();
    const amount = preAmount.includes("/")
      ? preAmount.split("/")[1]
      : preAmount;

    switch (name) {
      case "Hospital":
        myRegion.buildings["1"] = Number(amount);
        break;
      case "Military base":
        myRegion.buildings["2"] = Number(amount);
        break;
      case "School":
        myRegion.buildings["3"] = Number(amount);
        break;
      case "Missile system":
        myRegion.buildings["4"] = Number(amount);
        break;
      case "Sea port":
        myRegion.buildings["5"] = Number(amount);
        break;
      case "Power plant":
        myRegion.buildings["6"] = Number(amount);
        break;
      case "Spaceport":
        myRegion.buildings["7"] = Number(amount);
        break;
      case "Airport":
        myRegion.buildings["8"] = Number(amount);
        break;
      case "House fund":
        myRegion.buildings["9"] = Number(amount);
        break;

      default:
        break;
    }
  });

  myRegion.regionName = document
    .querySelector(".white.slide_title")
    .textContent.split(" and")[0];

  console.log(myRegion);

  GM_setValue("my-region", myRegion);
}

class Region {
  regionName = "";
  buildings = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };
}
