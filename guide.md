
# RR Mod guide

This guide is aimed to anyone who wants to install and use userscripts/mods in the [Rival Regions][rr] game both in mobile and PC platforms.

### What are userscripts?

*Userscript* is simply a way to call a piece of JavaScript code that is installed by the user to be run along specific websites to modify in many ways the behavior of the site. In particular case of Rival Regions it can be used to automate tasks, add features not available on mobile/pc, change the theme, extract data, etc.

Generally userscripts are installed by adding to your browser an userscript manager extension such as ViolentMonkey, TamperMonkey or GreaseMonkey.

This guide will focus mostly on [ViolentMonkey][vm] as it has some extra configuration features and works both in PC and Mobile.

**Reminder:** From what is known, userscripts only work on the web browser version of the game and will never work in the mobile app.

### Installation and usage

- **Windows/Linux/MacOS:**
    - Have a web browser. Firefox or Chrome will work fine but any other that allows installing extensions/add-ons/plugins will most likely work aswell.
    - Install an usercript manager extension, [ViolentMonkey][vm] is my recomendation but TamperMonkey/GreaseMonkey will also work.

- **Android:**
    - **Important:** The usage of userscripts in smartphones is experimental and isn't supported by most browsers. Until now, neither Chrome or Firefox allow to install any userscript manager.
    - However there are a few broswers that allow the installation of extensions such as [Kiwi Browser][kiwi], Yandex or Ungoogled Chromium Android (very experimental extension support). Nowadays Kiwi seems to be the most polished and stable solution.
    - On mobile the only usescript manager extension that seems to work properly is [ViolentMonkey][vm].
    - Antoher posible way to use userscripts in mobile is using [Adguard app][adguard] (**paid feature**), which is meant to block ads system-wide but also has a script manager built in which works with any browser as long as the app is running in the background.


- **Both:** Now your browser is ready to install some scripts. You can pick one from my [collection][scripts]. In order to install a script you can simply open the script url in your browser and your userscript manager will do the rest.

### Configuration Values
Some scripts will have some configurations values (GM_values) that need to be changed. ViolentMonkey easily allows this in the values tab while editing the script.
Adguard and TamperMonkey don't allow changing the values manually, so you might have to edit the script code to change the default values (however they will be erased whenever the script gets updated).

![values]

### Updating a script

Userscripts will get updated whenever it's author pushes an update in his repository. ViolentMonkey defaults to checking updates once a day but you can also manually check for updates.
> If you do not want to receive any updates just delete the `@downloadURL`line in the script headers.

### CSS userstyles mods

This other type of mod only modifies the CSS styles of the page, which can be used to create new themes for RivalRegions (or any other page). To inject userstyles you can use [Stylus][stylus] extension or similar.

### Further information

> **Mobile users:** From my tests mobile browsers seem to pause the execution of JavaScript when the browser is in the background to avoid battery drainage. So fully automated bots cannot be acomplished unless the page is in the foreground and the device has the screen unlocked, but this was barely tested by me.

> **iOS Users:** The only solution I know is using [Gear Browser][gear] which seems to support userscripts, although this feature is paid and haven't been tested at all by me as I don't own an Iphone device. Please notify if you been able to test this or any other solution to update this guide.


[rr]: https://rivalregions.com

[kiwi]: https://play.google.com/store/apps/details?id=com.kiwibrowser.browser

[vm]: https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag

[values]: https://raw.githubusercontent.com/pbl0/refill_gold_rr/master/values.jpg

[adguard]: https://adguard.com/es/adguard-android/overview.html

[scripts]: https://github.com/pbl0/rr-scripts/blob/main/README.md

[gear]: https://apps.apple.com/us/app/gear-browser/id1458962238

[stylus]: https://github.com/openstyles/stylus#releases
