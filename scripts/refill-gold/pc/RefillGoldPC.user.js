// ==UserScript==
// @name        RefillGoldScriptPC
// @namespace   https://pablobls.tech/
// @match       *://rivalregions.com/
// @grant       GM_getValue
// @grant       GM_setValue
// @version     0.0.3
// @author      Pablo
// @description just refills da gold
// @downloadURL https://github.com/pbl0/rr-scripts/raw/main/scripts/refill-gold/pc/RefillGoldPC.user.js
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// ==/UserScript==

/**
 * Update 0.0.2 -> Fix on request
 *
 * */ 

// State ID of your state:
const myState = GM_getValue("myState"); //  "3006";
// Hours it should wait for next refill ( default 2 ):
const hours = GM_getValue("hours");
// If gold level is below this it will refill (only works in your current region) ( default 250 ):
const threshold = GM_getValue("threshold");

const showTable = GM_getValue("table", true);

var tabla;

// First time
if (!myState) {
  GM_setValue("myState", "3006");
  const myState = GM_getValue("myState");
}
if (!hours) {
  GM_setValue("hours", 2);
  const hours = GM_getValue("hours");
}
if (!threshold) {
  GM_setValue("threshold", 250);
  const threshold = GM_getValue("threshold");
}

var autoRefillInterval;
const timePassed = (hours * 3600000);
$(document).ready(function () {
  window.addEventListener("popstate", listener);

  const pushUrl = (href) => {
    history.pushState({}, "", href);
    window.dispatchEvent(new Event("popstate"));
  };

  listener();
});

function listener() {
  if (location.href.includes("#overview")) {
    mainPage();
    console.log("#main");
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

function refill_gold() {
  // Fetch
  fetch("https://rivalregions.com/parliament/donew/42/0/0", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/x-www-form-urlencoded",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest"
    },
    "referrer": "https://rivalregions.com/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": `tmp_gov='0'&c=${c_html}`,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
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
          // deleteTable();
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function workPage() {
  var total = $(
    "div.mob_box_inner.mob_box_5_clean.float_left.imp.tc> div.yellow.small_box"
  ).text();
  if (
    $(".mslide.yellow").html() < threshold &&
    JSON.parse(localStorage.getItem("is_my_state")) &&
    total != "2500/2500"
  ) {
    refill_gold();
  }
}

function mainPage() {
  var mainPageInterval = setInterval(function () {
    if ($("#index_region").length && !$("#my_mob_box").length) {
      clearInterval(mainPageInterval);

      if (
        $(
          "#index_region > div:nth-child(2) > div.float_left.index_mig_links.hov2.imp.pointer"
        )
          .attr("action")
          .replace("map/state_details/", "") == myState
      ) {
        if (!$("#my_refill").length) {
          addMenu(true);
          $("#my_refill").click(refill_gold);
          $("#auto_refill").click(autoRefill);
        }

        localStorage.setItem("is_my_state", true);
      } else {
        addMenu(false);
        localStorage.setItem("is_my_state", false);
      }
    }
  });
}

function addMenu(isOn) {
  let lastRefill = new Date(
    JSON.parse(localStorage.getItem("last_refill"))
  ).toLocaleString();
  var buttonColor;
  var buttonText;
  if (isOn) {
    buttonColor = "blue";
    buttonText = "Refill now";
    if (false) {
      addTable();
    }

    autoRefillButton = '<div id="auto_refill" class="button_green index_auto pointer mslide">AutoRefill (beta)</div>';
  } else {
    buttonColor = "white";
    buttonText = "Not your state";
    autoRefillButton = "";
  }
  const myVersion = GM_info.script.version;
  $("body").append(
    `<div id="my_refill" class="button_${buttonColor} index_auto pointer mslide">${buttonText}</div>
    <div class="small white">Last refill: ${lastRefill} (state:${myState})
    <br>
    <span class='addit_2 small'> Script by @pablo_rr (v${myVersion}) </span>
    <br>
    ` +
    autoRefillButton +
    "</div>"
  );
}

function autoRefill() {
  console.log("auto refill on");
  $("#auto_refill").removeClass("button_green").addClass("button_white");
  autoRefillInterval = setInterval(function () {
    refill_gold();
    console.log('autorefilled')
  }, timePassed);
}

function refillFromTable() {
  var doRefill = false;
  $("#list_tbody>tr").each(function () {
    // console.log($(this).text());

    var limitLeft = $(this).find("td:nth-child(6)").text();

    if (limitLeft > 0) {
      var explored = $(this).find("td:nth-child(3)").text();
      if (explored <= threshold) {
        doRefill = true;
        console.log($(this).text());
      }
    }
  });

  if (doRefill) {
    console.log("Refill (table)");
    refill_gold();
  } else {
    console.log("No Refill (table)");
  }
}

function deleteTable() {
  tabla = null;
}

// function addTable() {
//   // Fetch
//   if (!tabla) {
//     fetch(
//       "https://rivalregions.com/listed/stateresources/3006?c=b8da01d023b874e8ffc118d05cfda734",
//       {
//         headers: {
//           accept: "text/html, */*; q=0.01",
//           "accept-language": "en-US,en;q=0.9",
//           "sec-fetch-dest": "empty",
//           "sec-fetch-mode": "cors",
//           "sec-fetch-site": "same-origin",
//           "x-requested-with": "XMLHttpRequest",
//         },
//         referrer: "https://rivalregions.com/",
//         referrerPolicy: "no-referrer-when-downgrade",
//         body: null,
//         method: "GET",
//         mode: "cors",
//         credentials: "include",
//       }
//     )
//       .then((response) => response.text())
//       .then((text) => {
//         let table = text.substring(text.indexOf("<table ")).split("</div>")[0];
//         $("#content > div.quests_get.white.tc").append(table);
//         refillFromTable();
//         // console.log(table);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   } else {
//     $("#content > div.quests_get.white.tc").append(tabla);
//   }
// }

