/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const HEADER = "Not Wordle, just my @firefox tabs:";
const FOOTER = "https://mzl.la/3sfOF1R";
const MAX_CHARS = 280; // Twitter default

// This seems to be how many characters Twitter budgets for a
// link, like the Taburdle link in the footer.
const FOOTER_CHARACTER_BUDGET = 6;

// The Unicode characters for the tab states are actually two
// characters wide, so we want half of the TAB_CHARS, minus another
const TAB_CHARS = Math.floor((MAX_CHARS - HEADER.length - FOOTER_CHARACTER_BUDGET) / 2) - 1;

browser.browserAction.onClicked.addListener(async () => {
  let tabs = await browser.tabs.query({ currentWindow: true });
  let tabStates = [];
  for (let i = 0; i < tabs.length && tabStates.length < TAB_CHARS; ++i) {
    if (i > 0 && i % 5 == 0) {
      tabStates.push("\n");
    }

    let tab = tabs[i];
    tabStates.push(tab.pinned ? `🟪` : tab.discarded ? `🟨` : `🟩`);
  }

  if (tabStates.length == TAB_CHARS) {
    tabStates.push("…");
  }

  let grid = tabStates.join("");

  let finalString = `${HEADER}\n${grid}\n${FOOTER}`;
  await navigator.clipboard.writeText(finalString);
  browser.notifications.create("taburdle-notification", {
    "type": "basic",
    "iconUrl": browser.runtime.getURL("icons/square.svg"),
    "title": "Tab grid copied",
    "message": "Your tab grid has been copied to your clipboard!"
  });
});
