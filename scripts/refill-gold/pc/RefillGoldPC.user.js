// ==UserScript==
// @name        RefillGoldScriptPC
// @namespace   https://pablob.eu/
// @match       *://*rivalregions.com/
// @grant       GM_getValue
// @grant       GM_setValue
// @version     0.0.5
// @author      Pablo
// @description just refills the gold
// @downloadURL https://github.com/pbl0/rr-scripts/raw/main/scripts/refill-gold/pc/RefillGoldPC.user.js
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// ==/UserScript==

/**
 * v0.0.5 -> Fix AutoRefill bug and fix on bug with independent regions.
 *           Add compatibility for turkish server.
 * v0.0.4 -> Remove jQuery, remove redundant functionality.
 *           Fix duplicated button bug. Get state id from profile.
 * v0.0.2 -> Fix on request
 *
 * */

// State ID of your state:
var myState = GM_getValue("myState"); // Eg "3006";
// Hours it should wait for next refill ( default 2 ):
var hours = GM_getValue("hours");
// If gold level is below this it will refill (only works in your current region) ( default 250 ):
// var threshold = GM_getValue("threshold");

var showTable = GM_getValue("table", true);

var tabla;

// First time
if (!myState) {
  GM_setValue("myState", "-");
  myState = GM_getValue("myState");
}
if (!hours) {
  GM_setValue("hours", 1);
  hours = GM_getValue("hours");
}
// if (!threshold) {
//   GM_setValue("threshold", 250);
//   threshold = GM_getValue("threshold");
// }

var autoRefillInterval;
const timePassed = hours * 3600000;

window.addEventListener("popstate", listener);

const pushUrl = (href) => {
  history.pushState({}, "", href);
  window.dispatchEvent(new Event("popstate"));
};

listener();

function listener() {
  if (location.href.includes("#overview")) {
    mainPage();
    console.log("#main");
  } else if (location.href.includes("#slide/profile/")) {
    let profile_button = document.getElementById("header_my_avatar");
    myId = profile_button.getAttribute("action").split("/")[2];
    if (location.href.includes(myId)) {
      profile_page();
    }
  }
  let lastRefill = localStorage.getItem("last_refill");
  if (
    JSON.parse(localStorage.getItem("is_my_state")) &&
    (lastRefill == null || c() - lastRefill > timePassed)
  ) {
    refill_gold();
    // addTable();
  }

  if (autoRefillInterval !== undefined) {
    clearInterval(autoRefillInterval);
    console.log("autoRefill is off");
    autoRefillInterval = undefined;
  }
}

function profile_page() {
  // let myStateDiv = document.querySelector("div.short_details:nth-child(3)");
  const moe_selector =
    ".p_sa_h > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(10) > td:nth-child(2)";
  const leader_selector = "h2.tip";
  const isMoe =
    document
      .querySelector(
        ".p_sa_h > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(10) > td:nth-child(1)"
      )
      .textContent.trim() == "Economic adviser:";
  const stateSelector = isMoe ? moe_selector : leader_selector;
  const myStateDiv = document.querySelector(stateSelector);
  const stateUrl = myStateDiv.getAttribute("action");
  const stateId = stateUrl.split("/")[2];
  if (myState != stateId) {
    GM_setValue("myState", stateId);
    myState = GM_getValue("myState");
  }
}

function refill_gold() {
  // Fetch
  fetch("/parliament/donew/42/0/0", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/x-www-form-urlencoded",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
    },
    referrer: `https://${location.host}/`,
    referrerPolicy: "strict-origin-when-cross-origin",
    body: `tmp_gov='0'&c=${c_html}`,
    method: "POST",
    mode: "cors",
    credentials: "include",
  })
    .then((response) => {
      // console.log(response);
      response.text().then((text) => {
        console.log(text);
        if (text == "no 2") {
          localStorage.setItem("is_my_state", false);
          console.log("wrong state");
        } else if (text == "ok") {
          localStorage.setItem("last_refill", c());
          console.log("gold refilled");
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function getStateActionAttr() {
  const stateSelector =
    "#index_region > div:nth-child(2) > div.float_left.index_mig_links.hov2.imp.pointer";
  const independentSelector =
    "div.index_case_50:nth-child(2) > div:nth-child(1) > span:nth-child(1)";

  let element = document.querySelector(stateSelector);

  element =
    element === null // null if independent state
      ? document.querySelector(independentSelector)
      : element;

  return element.getAttribute("action").replace("map/state_details/", "");
}

function mainPage() {
  var mainPageInterval = setInterval(function () {
    if (
      document.getElementById("index_region") &&
      !document.getElementById("my_mob_box")
    ) {
      clearInterval(mainPageInterval);
      if (myState == "-") {
        addMenu(false, true);
        localStorage.setItem("is_my_state", false);
      } else if (getStateActionAttr() == myState) {
        if (!document.getElementById("my_refill")) {
          addMenu(true, false);
          document
            .getElementById("my_refill")
            .addEventListener("click", refill_gold);

          document
            .getElementById("auto_refill")
            .addEventListener("click", autoRefill);
        }

        localStorage.setItem("is_my_state", true);
      } else {
        if (!document.getElementById("my_refill")) {
          addMenu(false, false);
          localStorage.setItem("is_my_state", false);
        }
      }
    }
  });
}

function addMenu(isOn, notSet) {
  let lastRefill = new Date(
    JSON.parse(localStorage.getItem("last_refill"))
  ).toLocaleString();
  var buttonColor;
  var buttonText;
  if (isOn) {
    buttonColor = "blue";
    buttonText = "Refill now";
    autoRefillButton =
      '<div id="auto_refill" class="button_green index_auto pointer mslide">AutoRefill (beta)</div>';
  } else if (notSet) {
    buttonColor = "red";
    buttonText = "Please access your profile page";
    autoRefillButton = "";
  } else {
    buttonColor = "white";
    buttonText = "Not your state";
    autoRefillButton = "";
  }
  const myVersion = GM_info.script.version;
  document.querySelector("body").insertAdjacentHTML(
    "beforeend",
    `<div id="my_refill" class="button_${buttonColor} index_auto pointer mslide">${buttonText}</div>
    <div class="small white">Last refill: ${lastRefill} (state:${myState})
    <br>
    <span class='addit_2 small'> Script by @pablobls (v${myVersion}) </span>
    <br>
    ` +
      autoRefillButton +
      "</div>"
  );
}

function autoRefill() {
  console.log("auto refill on");
  let element = document.getElementById("auto_refill");
  element.classList.remove("button_green");
  element.classList.add("button_white");
  autoRefillInterval = setInterval(function () {
    refill_gold();
    console.log("autorefilled");
  }, timePassed);
}
