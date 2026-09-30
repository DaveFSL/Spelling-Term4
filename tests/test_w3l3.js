const { load, check, click, type, key, staticChecks, sectionEndsWithEvidence, done } = require("./harness");
const FILE = "Wk3_Lesson3_Melt_and_Rebuild.html";
console.log("== " + FILE);
staticChecks(FILE);
const { w, d, errors } = load(FILE);
const $ = s => d.querySelector(s), $$ = s => [...d.querySelectorAll(s)];
const wait = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  check($$(".q").length === 5, "5 warm-up questions");
  check(!/\/[kf]\//.test(d.body.innerHTML) && !/cher sound|“cher”/.test(d.body.innerHTML), "lesson 3 uses letter patterns, not sound names");
  click($$("#q0 .opt")[0]); check(d.activeElement === $("#fix0"), "wrong answer focuses the fix-up");
  check($$("#casenotes .remember").length === 2, "2 teaching cards with Remember lines");
  check($$("nav.pills a[href^='#']").every(a => d.getElementById(a.getAttribute("href").slice(1))), "nav pills point at real sections");
  // melt & rebuild
  const word = () => $$("#ice span").map(s => s.textContent).join("");
  let wd = word();
  check(wd.length > 5 && $("#rebuild").hidden, "word shows frozen; rebuild hidden while studying");
  check($$(".mchip").every(c => /^Word \d$/.test(c.textContent)), "progress chips don't show spellings in advance");
  click($("#meltBtn"));
  check($("#ice").getAttribute("aria-hidden") === "true", "melting word is hidden from screen readers");
  await wait(1450);
  check($("#ice").textContent === "" && !$("#rebuild").hidden, "after melting, the word is gone and tiles appear");
  check($$("#slots .lslot").length === wd.length && $$("#tray .ltile").length === wd.length + 2, "slots = word length; tiles include two decoys");
  check($("#checkBtn").disabled, "Check locked until every box is filled");
  // build a WRONG answer: reverse the correct letters
  const tilesFor = str => { const used = new Set(); return str.split("").map(ch => { const t = $$("#tray .ltile").find(x => x.textContent === ch && !used.has(x.dataset.t)); used.add(t.dataset.t); return t; }); };
  const rev = wd.split("").reverse().join("");
  tilesFor(rev).forEach(t => click(t));
  check(!$("#checkBtn").disabled, "Check unlocks when full");
  click($("#checkBtn"));
  check($("#meltFix").classList.contains("show") && $$("#slots .lslot.bad").length > 0, "wrong rebuild marks amber boxes with a trap clue");
  check(!new RegExp("\\b" + wd + "\\b").test($("#meltFix").textContent), "fix-up doesn't spell the whole word");
  // unfill all and rebuild correctly
  $$("#slots .lslot").forEach((s, k) => click(s));
  check($$("#tray .ltile").every(t => !t.disabled) && $("#checkBtn").disabled, "tapping boxes returns letters to the tray");
  tilesFor(wd).forEach(t => click(t));
  click($("#checkBtn"));
  check(/rebuilt correctly/.test($("#meltMsg").textContent) && $$(".mchip.first").length === 1, "correct rebuild → green chip");
  // next word: use refreeze path
  click($("#nextBtn"));
  wd = word();
  click($("#meltBtn")); await wait(1450);
  click($("#refreezeBtn"));
  check(word() === wd && !$("#meltBtn").hidden, "freeze again shows the word to study again");
  click($("#meltBtn")); await wait(1450);
  tilesFor(wd).forEach(t => click(t)); click($("#checkBtn"));
  check($$(".mchip.again").length === 1, "rebuilt after re-study → teal chip");
  // finish the rest
  for (let i = 2; i < 8; i++) {
    click($("#nextBtn")); wd = word(); click($("#meltBtn")); await wait(1400);
    tilesFor(wd).forEach(t => click(t)); click($("#checkBtn"));
  }
  check(/All eight rebuilt/.test($("#meltMsg").textContent), "completion message after 8 words");
  // writing + spy
  check($$("#spy .chip").length === 0, "Spy empty before writing");
  type(w, $("#writebox"), "Condensation is reversible. Cooking is irreversible and chemical.");
  check($("#spy .spy-count").textContent === "4", "Spy counts correctly spelt focus words");
  // dictation
  check($("#dictReveal").disabled && $("#dictAnswers").hidden, "dictation answers locked");
  $("#dictReady").checked = true; $("#dictReady").dispatchEvent(new w.Event("change"));
  click($("#dictReveal"));
  const plan = require("./dictation_w3.json");
  const shown = $$("#dictList li").map(li => [li.querySelector(".dword").textContent, li.querySelector(".dsent").textContent]);
  check(JSON.stringify(shown) === JSON.stringify(plan), "dictation matches unit plan byte-for-byte");
  click($$(".dmark")[0]); click($$(".dmark")[5]);
  check($("#dictScore").textContent === "2", "self-mark score");
  sectionEndsWithEvidence(d, ["briefing", "melt", "homesci", "dictation", "closed"]);
  await wait(200);
  check(errors.length === 0, "zero console/page errors " + (errors.length ? JSON.stringify(errors) : ""));
  done();
})();
