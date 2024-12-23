// ==UserScript==
// @name        Region Extract Tool
// @namespace   https://rr-tools.eu/
// @match       *://rivalregions.com/*
// @match       *://rr-tools.eu/*
// @author      Pablo
// @description
// @grant GM_setValue
// @grant GM_getValue
// @version     0.6
// @downloadURL https://github.com/pbl0/rr-scripts/raw/main/scripts/region-extract-tool/region-extract.user.js
// ==/UserScript==

/**
 * v0.5 - fix on button inside rr-tools.eu, remove jQuery
 * v0.5.1 - fixes a bug with regions in energy insolvent states that didn't allow to be extracted. (By @bagd1k)
 * v0.6 - multi-lang support. EN, RU, ES, PT for now.
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

    updateBuilding(name, amount);
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

const buildingsMap = {
  // English, Russian, Spanish, Portuguese. Omit duplicates.
  1: ["Hospital", "Госпиталь"],
  2: ["Military base", "Военная база", "Base militar"],
  3: ["School", "Школа", "Escuela", "Escola"],
  4: ["Missile system", "ПВО", "Sistema de misiles", "Sistema de mísseis"],
  5: ["Sea port", "Порт", "Puerto naval", "Porto Maritimo"],
  6: ["Power plant", "Электростанция", "Planta de energía", "Usina de energia"],
  7: ["Spaceport", "Космодром", "Puerto espacial"],
  8: ["Airport", "Аэропорт", "Aeropuerto", "Aeroporto"],
  9: ["House fund", "Жилой фонд", "Vivienda", "Fundo de Habitação"],
};

function updateBuilding(name, amount) {
  const buildingID = Object.keys(buildingsMap).find((id) =>
    buildingsMap[id].includes(name)
  );

  if (buildingID) {
    myRegion.buildings[buildingID] = Number(amount);
  }
}
