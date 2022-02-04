/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const HEADER = "Not Wordle, just my Firefox tabs:";
const FOOTER = "https://bit.ly/3L2Wm46";

browser.browserAction.onClicked.addListener(async () => {
  let tabs = await browser.tabs.query({ currentWindow: true });
  let grid = tabs
    .map(tab => tab.pinned ? `🟪` : tab.discarded ? `🟨` : `🟩`)
    .reduce((acc, curr) => {
      if (acc.at(-1).length == 10) {
        acc.push("");
      }
      acc[acc.length - 1] += curr;
      return acc;
    }, [""]).join("\n");
  let finalString = `${HEADER}\n${grid}\n${FOOTER}`;
  await navigator.clipboard.writeText(finalString);
  browser.notifications.create("taburdle-notification", {
    "type": "basic",
    "iconUrl": browser.runtime.getURL("icons/square.svg"),
    "title": "Tab grid copied",
    "message": "Your tab grid has been copied to your clipboard!"
  });
});
