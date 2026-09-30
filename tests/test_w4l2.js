const { load, check, click, type, key, staticChecks, sectionEndsWithEvidence, done } = require("./harness");
const FILE = "Wk4_Lesson2_Silent_Letter_Scanner.html";
console.log("== " + FILE);
staticChecks(FILE);
const { w, d, errors } = load(FILE);
const $ = s => d.querySelector(s), $$ = s => [...d.querySelectorAll(s)];
(async () => {
  check($$(".q").length === 5, "5 warm-up questions");
  click($$("#q0 .opt")[1]); check(d.activeElement === $("#fix0"), "wrong answer focuses the fix-up");
  check($$("#casenotes .remember").length === 6, "6 teaching cards with Remember lines");
  check($$("nav.pills a[href^='#']").every(a => d.getElementById(a.getAttribute("href").slice(1))), "nav pills point at real sections");
  const ids = $$("[id]").map(e => e.id); check(new Set(ids).size === ids.length, "no duplicate ids");
  // scanner
  const r = $("#scanRange");
  const word = () => $$("#scanWord .sl").map(b => b.textContent).join("");
  check(word() === "receipt" && r.max === "6", "first word receipt, slider range fits word");
  check(/Letter 1 of 7: r/.test(r.getAttribute("aria-valuetext")), "slider has aria-valuetext");
  click($$("#scanWord .sl")[3]);
  check(r.value === "3" && $$("#scanWord .sl")[3].classList.contains("beam"), "tapping a letter moves the beam");
  click($("#scanMark"));
  check($("#scanFix").classList.contains("show") && !/Clue:/.test($("#scanFix").textContent), "first wrong mark: nudge, no clue");
  click($("#scanMark"));
  check(/reception/.test($("#scanFix").textContent), "second wrong mark: family-word clue");
  r.value = 5; r.dispatchEvent(new w.Event("input", { bubbles: true }));
  click($("#scanMark"));
  check($$("#scanWord .sl")[5].classList.contains("found") && !$("#scanNext").hidden, "silent p found; next unlocked");
  check($$(".schip").filter(c => /word \d/.test(c.textContent)).length === 7, "unscanned chips don't reveal words");
  const ans = { guarantee:1, debt:2, design:4, honest:0, wrapping:0, sign:2, wholesale:0 };
  for (let i = 0; i < 7; i++) { click($("#scanNext")); r.value = ans[word()]; r.dispatchEvent(new w.Event("input")); click($("#scanMark")); }
  check(/All eight silent letters/.test($("#scanMsg").textContent), "completion after 8 words");
  // LCWC
  check(/Word 1 of 4 · Round 1/.test($("#lcRound").textContent), "LCWC counter");
  check($$("#resBody td").filter((t,i)=>i%3===0).every(t => /^Word \d$/.test(t.textContent)), "results table hides spellings before checking");
  click($("#coverBtn"));
  check($("#lcWord").getAttribute("aria-hidden") === "true", "covered word is aria-hidden");
  type(w, $("#lcIn"), "reciept"); click($("#lcCheck"));
  check(!/receipt/.test($("#lcMsg").textContent), "visible feedback doesn't name the target word");
  for (let i = 1; i < 8; i++) { click($("#lcNext")); const wd = $("#lcWord").textContent; click($("#coverBtn")); type(w, $("#lcIn"), wd); key(w, $("#lcIn"), "Enter"); }
  click($("#challengeBtn"));
  check($("#lcWord").textContent === "manufacturer" && /Word 5 of 6/.test($("#lcRound").textContent), "challenge words continue at the end");
  sectionEndsWithEvidence(d, ["briefing", "scanner", "lcwc", "closed"]);
  await new Promise(r => setTimeout(r, 200));
  check(errors.length === 0, "zero console/page errors " + (errors.length ? JSON.stringify(errors) : ""));
  done();
})();
