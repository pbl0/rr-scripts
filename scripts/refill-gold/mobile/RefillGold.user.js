// ==UserScript==
// @name        RefillGoldScript
// @namespace   https://pablob.eu/
// @match       https://m.rivalregions.com/
// @match       http://m.rivalregions.com/
// @version     0.1.2
// @author      Pablo
// @description just refills the gold (MOBILE)
// @run-at document-idle
// @downloadURL https://github.com/pbl0/rr-scripts/raw/main/scripts/refill-gold/mobile/RefillGold.user.js
// ==/UserScript==

/**
 * v0.1.2 -> Remove redundant functionality. Fix bug with duplicated button.
 * v0.1.0 -> port to bromite & auto-updates state id from user profile page
 * v0.0.8 -> small fix
 * v0.0.7 -> Fix on request
 * */

// State ID of your state:
var myState = localStorage.getItem("myState"); //  Example: "3006";
// Hours it should wait for next refill ( default 2 ):
var hours = localStorage.getItem("hours");
// If gold level is below this it will refill (only works in your current region) ( default 250 ):
var threshold = localStorage.getItem("threshold");

// First time
if (!myState) {
  localStorage.setItem("myState", "-");
  myState = localStorage.getItem("myState");
}
if (!hours) {
  localStorage.setItem("hours", 1);
  hours = localStorage.getItem("hours");
}
if (!threshold) {
  localStorage.setItem("threshold", 250);
  threshold = localStorage.getItem("threshold");
}

const timePassed = hours * 3600000;

window.addEventListener("popstate", listener);

const pushUrl = (href) => {
  history.pushState({}, "", href);
  window.dispatchEvent(new Event("popstate"));
};

listener();

function listener() {
  if (location.href.includes("#main")) {
    mainPage();
  } else if (location.href.includes("#slide/profile/")) {
    let profile_button = document.querySelector(
      "#mob_menu > div.float_left.header_avatar.pointer.tc.mob_lower_one"
    );
    myId = profile_button.getAttribute("action").split("/")[2];
    if (location.href.includes(myId)) {
      profile_page();
    }
  }
  let lastRefill = localStorage.getItem("last_refill");
  if (
    localStorage.getItem("is_my_state") &&
    (lastRefill == null || new Date().getTime() - lastRefill > timePassed)
  ) {
    refill_gold();
  }
}

function refill_gold() {
  fetch("https://m.rivalregions.com/parliament/donew/42/0/0", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "sec-ch-ua": '"Chromium";v="91", " Not;A Brand";v="99"',
      "sec-ch-ua-mobile": "?1",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
    },
    referrer: "https://m.rivalregions.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: `tmp_gov='0'&c=${get_c()}`,
    method: "POST",
    mode: "cors",
    credentials: "include",
  })
    .then((response) => {
      response.text().then((text) => {
        if (text == "no 2") {
          localStorage.setItem("is_my_state", false);
        } else if (text == "ok") {
          localStorage.setItem("last_refill", new Date().getTime());
          deleteTable();
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function mainPage() {
  var mainPageInterval = setInterval(function () {
    if (
      document.getElementById("mob_box_region_1") &&
      !document.getElementById("my_mob_box")
    ) {
      clearInterval(mainPageInterval);
      if (myState == "-") {
        addMenu(false, true);
        localStorage.setItem("is_my_state", false);
      } else if (
        document
          .getElementById("mob_box_region_2")
          .getAttribute("action")
          .replace("map/state_details/", "") == myState
      ) {
        if (!document.getElementById("my_refill")) {
          addMenu(true, false);
          document
            .getElementById("my_refill")
            .addEventListener("click", refill_gold);
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

function profile_page() {
  let myStateDiv = document.querySelector("div.short_details:nth-child(3)");
  let stateUrl = myStateDiv.getAttribute("action");
  let stateId = stateUrl.split("/")[2];
  if (myState != stateId) {
    localStorage.setItem("myState", stateId);
    myState = localStorage.getItem("myState");
  }
}

function addMenu(isOn, notSet) {
  let lastRefill = new Date(
    JSON.parse(localStorage.getItem("last_refill"))
  ).toLocaleString();
  var buttonColor;
  var buttonText;
  if (isOn) {
    buttonColor = "link";
    buttonText = "Refill now";
  } else if (notSet) {
    buttonColor = "red";
    buttonText = "Please access your profile page";
  } else {
    buttonColor = "white";
    buttonText = "Not your state";
  }
  document.querySelector(".mob_box.mob_box_region_s").insertAdjacentHTML(
    "beforeend",
    `<div id="my_refill" class="button_${buttonColor} index_auto pointer mslide">${buttonText}</div>
          <div class="tiny">Last refill: ${lastRefill} (state:${myState})
          <span class='addit_2'> Script by @pablobls</span>
    </div>`
  );
}

function get_c() {
  let c;
  if (typeof c_html != "undefined") {
    c = c_html;
  } else {
    c = document
      .getElementsByTagName("script")[1]
      .innerHTML.split("c : '")[1]
      .split("'},\n")[0];
  }
  return c;
}
function resetLocalStorage() {
  localStorage.removeItem("hours");
  localStorage.removeItem("is_my_state");
  localStorage.removeItem("myState");
  localStorage.removeItem("threshold");
}
