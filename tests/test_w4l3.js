const { load, check, click, type, key, staticChecks, sectionEndsWithEvidence, done } = require("./harness");
const FILE = "Wk4_Lesson3_Budget_Cart.html";
console.log("== " + FILE);
staticChecks(FILE);
const { w, d, errors } = load(FILE);
const $ = s => d.querySelector(s), $$ = s => [...d.querySelectorAll(s)];
const WORDS = ["consumer","advertisement","persuasive","influence","purchase","necessity","receipt","guarantee"];
(async () => {
  check($$(".q").length === 5, "5 warm-up questions");
  click($$("#q0 .opt")[0]); check(d.activeElement === $("#fix0"), "wrong answer focuses the fix-up");
  check($$("nav.pills a[href^='#']").every(a => d.getElementById(a.getAttribute("href").slice(1))), "nav pills point at real sections");
  const ids = $$("[id]").map(e => e.id); check(new Set(ids).size === ids.length, "no duplicate ids");
  // shelf doesn't leak words
  const shelfText = $("#shelf").textContent.toLowerCase();
  check(WORDS.every(wd => !shelfText.includes(wd)), "shelf clues never show the target words");
  const labels = $$("#shelf label").map(l => l.textContent.toLowerCase()).join(" ");
  check(WORDS.every(wd => !labels.includes(wd)), "screen-reader labels don't leak words");
  check($("#bcAdd0").disabled, "Add locked until typed");
  check($$(".len").every(l => l.hidden), "letter counts hidden before a first try");
  // wrong tries -> hints escalate
  type(w, $("#bcIn6"), "reciept"); click($("#bcAdd6"));
  check(!$("#bcHint6").hidden && !/Trap/.test($("#bcHint6").textContent), "try 1: plain retry message");
  check(!$("#bcLen6").hidden && $$(".len").filter(l => !l.hidden).length === 1, "letter count appears only on the missed item");
  click($("#bcAdd6"));
  check(/Trap clue/.test($("#bcHint6").textContent) && !/receipt/.test($("#bcHint6").textContent), "try 2: trap clue without the answer");
  click($("#bcAdd6"));
  check(/starts with “rec”/.test($("#bcHint6").textContent), "try 3: first three letters");
  type(w, $("#bcIn6"), "Receipt "); click($("#bcAdd6"));
  check($("#bcItem6").classList.contains("bought") && /Spent \$3 of \$40/.test($("#cartStatus").textContent), "correct (case/space-insensitive) → added, budget updates");
  WORDS.forEach((wd, i) => { if (i === 6) return; type(w, $("#bcIn" + i), wd); key(w, $("#bcIn" + i), "Enter"); });
  check(!$("#receiptOut").hidden && /TOTAL\$36\.00/.test($("#receiptOut").textContent.replace(/\s/g,"")) && /Change\$4\.00/.test($("#receiptOut").textContent.replace(/\s/g,"")), "receipt prints with total $36 and $4 change");
  // writing
  type(w, $("#writebox"), "Every purchase has a guarantee so keep your receipt. It is not a necessity.");
  check($("#spy .spy-count").textContent === "4", "Spy counts focus words");
  // dictation
  check($("#dictReveal").disabled && $("#dictAnswers").hidden, "dictation answers locked");
  $("#dictReady").checked = true; $("#dictReady").dispatchEvent(new w.Event("change"));
  click($("#dictReveal"));
  const plan = require("./dictation_w4.json");
  const shown = $$("#dictList li").map(li => [li.querySelector(".dword").textContent, li.querySelector(".dsent").textContent]);
  check(JSON.stringify(shown) === JSON.stringify(plan), "dictation matches unit plan byte-for-byte");
  sectionEndsWithEvidence(d, ["briefing", "cart", "honestad", "dictation", "closed"]);
  await new Promise(r => setTimeout(r, 200));
  check(errors.length === 0, "zero console/page errors " + (errors.length ? JSON.stringify(errors) : ""));
  done();
})();
