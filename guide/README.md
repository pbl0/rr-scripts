
# RR mods guide

This guide is aimed at anyone who wants to install and use user scripts (mods) in [Rival Regions][rr] game both on mobile and PC.

* * *
### What are user scripts?

Scripts are like mods but for websites. They make the game better by adding features, making them easier to use, or taking out the annoying bits, extracting data, automating tasks etc.

> **Reminder:** From what is known, scripts only work on the web browser version of the game and won't work on the mobile app (at lest in an easy way).

### Installation and usage

To use scripts you need to first install a script manager extension. Some of the most popular ones are ViolentMonkey, TamperMonkey, GreaseMonkey.

This guide will focus mostly on [ViolentMonkey][vm] as it has some extra configuration features and it works both on PC and Mobile.

- **Windows/Linux/MacOS:**
    - Install an script manager extension, [ViolentMonkey][vm] is my recommendation but TamperMonkey/GreaseMonkey should also work.

- **Android:**
    - > **Important:** The usage of scripts in smart-phones is experimental and isn't supported by most browsers. Until now, neither Chrome or Firefox allow to install any script manager.
    - There are a few browsers that support extensions such as [Kiwi Browser][kiwi] which will require to install [ViolentMonkey][vm].
    - Another option is to install [Bromite](https://www.bromite.org/) as it supports scripts by default, although some of my scripts won't work.
    - An alternative way to use user scripts in mobile is using [Adguard app][adguard] (**paid feature**), which is meant to block ads system-wide but also has a built-in script manager. This works on any browser as long as the Adguard app is running in the background.


- **Both:** Now that your browser is ready to install some scripts, you can pick one from my [collection][scripts]. In order to install a script you can simply open the script url in your browser and your user script manager will do the rest.

- Once the script is installed just visit the game (or the specific page it affects). It should automatically do its thing.

### Configuration Values
Some scripts might have configurations values (GM_values) that you might want to change. ViolentMonkey easily allows this in the values tab while editing the script. Bromite doens't seem to support these GM_values so this scripts won't work.

Adguard and TamperMonkey don't seem to allow changing the values manually, so you might have to edit the script code to change the default values (however these will get erased whenever the script gets updated).

### Things you could do when a user script breaks

- Refresh rivalregions page ( press F5 )
- Close tab/browser
- Re-install script
- Open the console to see any errors ( press F12 on PC )
- Disable other scripts.
- You need to refresh whenever you disable/enable scripts
- Contact script author

> **Important:** Most of my scripts will only work with the english language setting.

### Updating a script

Scripts will get updated whenever it's author pushes an update in their repository. ViolentMonkey defaults to checking updates once a day but you can also manually check for updates.
> If you do not want to receive any updates just delete the `@downloadURL` line in the script headers.

### Further information

**Mobile users:** Mobile browsers seem to pause the execution of JavaScript when the browser is in the background to avoid battery drainage. So fully automated bots cannot be accomplished unless the page is in the foreground and the device has the screen unlocked. For that reason my mobile scripts won't fully automate anything.

**iOS Users:** The only solution I found would be using [Gear Browser][gear], although this feature seems to be paid-only and I haven't tested it. Please notify if you been able to test this or any other solution to update this guide.


[rr]: https://rivalregions.com

[kiwi]: https://play.google.com/store/apps/details?id=com.kiwibrowser.browser

[vm]: https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag

[values]: https://raw.githubusercontent.com/pbl0/refill_gold_rr/master/values.jpg

[adguard]: https://adguard.com/es/adguard-android/overview.html

[scripts]: https://rr-tools.eu/mods

[gear]: https://apps.apple.com/us/app/gear-browser/id1458962238

[stylus]: https://github.com/openstyles/stylus#releases

* * *
> _Updated: Dec 8 2022_