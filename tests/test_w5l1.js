const { load, check, click, type, key, staticChecks, sectionEndsWithEvidence, done } = require("./harness");
const FILE = "Wk5_Lesson1_Timetable_Builder.html";
console.log("== " + FILE);
staticChecks(FILE);
const { w, d, errors } = load(FILE);
const $ = s => d.querySelector(s), $$ = s => [...d.querySelectorAll(s)];
(async () => {
  check($$(".q").length === 5, "5 warm-up questions");
  click($$("#q0 .opt")[1]); check(d.activeElement === $("#fix0"), "wrong answer focuses the fix-up");
  check($$("#casenotes .remember").length === 3, "3 teaching cards with Remember lines");
  check($$("nav.pills a[href^='#']").every(a => d.getElementById(a.getAttribute("href").slice(1))), "nav pills point at real sections");
  const ids = $$("[id]").map(e => e.id); check(new Set(ids).size === ids.length, "no duplicate ids");
  check($$(".slot").every(sl => !/ \.|blank \,/.test(sl.getAttribute("aria-label"))), "gap labels have no stray space before punctuation");
  check(!/silent/i.test($("#quiz").textContent + [...d.querySelectorAll(".fixup")].map(f => f.innerHTML).join("")), "no sound talk (silent letters) in the Lesson 1 warm-up");
  const tiles = $$(".wtile"), slots = $$(".slot");
  check(tiles.length === 8 && slots.length === 8, "8 word tiles, 8 timetable gaps");
  const tile = wd => tiles.find(t => t.dataset.word === wd);
  // slot 0 = schedule. Wrong: tap anxious then slot 0
  click(slots[0]); check(/Pick a word/.test($("#ttMsg").textContent), "tapping a gap first gives guidance");
  key(w, tile("anxious"), "Enter"); click(slots[0]);
  check(/Not “anxious”/.test($("#ttMsg").textContent) && !$("#tt0").classList.contains("right"), "wrong word bounces back with meaning + clue");
  check(!/schedule/.test($("#ttMsg").textContent), "wrong-answer clue doesn't name the answer");
  // keyboard: Enter picks
  key(w, tile("schedule"), "Enter"); check(tile("schedule").getAttribute("aria-pressed") === "true", "Enter picks up a tile");
  click(slots[0]); check($("#tt0").classList.contains("right") && slots[0].disabled, "correct word locks in");
  const order = ["schedule","independent","responsibility","anxious","confidence","opportunity","resilience","secondary"];
  order.forEach((wd, i) => { if (i === 0) return; key(w, tile(wd), "Enter"); click(slots[i]); });
  check(/Year 7 Monday is planned/.test($("#ttMsg").textContent) && $("#ttCount").textContent === "8 of 8 filled", "all 8 → completion");
  click($("#ttHint")); check(/no hints needed/.test($("#ttMsg").textContent), "hint after completion");
  type(w, $("#writebox"), "In secondary school I might feel anxious but I will check my schedual.");
  check($("#spy .spy-count").textContent === "2", "Spy counts only correct spellings");
  sectionEndsWithEvidence(d, ["briefing", "timetable", "strategy", "closed"]);
  await new Promise(r => setTimeout(r, 700));
  check(errors.length === 0, "zero console/page errors " + (errors.length ? JSON.stringify(errors) : ""));
  done();
})();
