const { load, check, click, type, key, staticChecks, sectionEndsWithEvidence, done } = require("./harness");
const FILE = "Wk5_Lesson2_Word_Family_Tree.html";
console.log("== " + FILE);
staticChecks(FILE);
const { w, d, errors } = load(FILE);
const $ = s => d.querySelector(s), $$ = s => [...d.querySelectorAll(s)];
(async () => {
  check($$(".q").length === 5, "5 warm-up questions");
  click($$("#q0 .opt")[0]); check(d.activeElement === $("#fix0") && /Lesson 1/.test($("#fix0").textContent), "wrong answer focuses a fix-up linking to Lesson 1 cards");
  check($$("#casenotes .remember").length === 6, "6 teaching cards with Remember lines");
  check($$("nav.pills a[href^='#']").every(a => d.getElementById(a.getAttribute("href").slice(1))), "nav pills point at real sections");
  const ids = $$("[id]").map(e => e.id); check(new Set(ids).size === ids.length, "no duplicate ids");
  // tree
  check(/independent/.test($("#trunk").textContent) && $$(".branch").length === 2, "first tree: independent with 2 branches");
  check($$(".fchip").filter(c => /^tree \d$/.test(c.textContent)).length === 8, "ungrown chips don't reveal words");
  const endBtn = (b, o) => $$("#br" + b + " .end").find(x => x.dataset.o === o);
  click(endBtn(0, "ance"));
  check($("#fFix").classList.contains("show") && d.activeElement === $("#fFix") && /-ent/.test($("#fFix").textContent), "wrong ending → focused fix-up pointing at the trunk");
  check(endBtn(0, "ance").classList.contains("tried"), "wrong choice marked amber");
  click(endBtn(0, "ence"));
  check($("#br0").classList.contains("grown") && $("#gap0").textContent === "ence", "right ending grows the branch");
  click(endBtn(1, "ently"));
  check(!$("#fNext").hidden && /family is complete/.test($("#fMsg").textContent), "tree complete → next tree");
  const ANS = { independent: ["ence","ently"], confident: ["ence","ently"], resilience: ["ent"], important: ["ance"], distance: ["ant"], patient: ["ence","ently"], tolerant: ["ance"], responsible: ["ility"], adolescent: ["ence"], persevere: ["ance"] };
  const grow = () => { const t = $("#trunk").childNodes[1].textContent; ANS[t].forEach((o, b) => click(endBtn(b, o))); return t; };
  for (let i = 1; i < 8; i++) { click($("#fNext")); grow(); }
  check(/All eight trees grown/.test($("#fMsg").textContent) && !$("#fChallenge").hidden, "8 trees → completion + challenge offered");
  click($("#fChallenge")); check($("#trunk").childNodes[1].textContent === "adolescent", "challenge trees appended");
  grow(); click($("#fNext")); grow();
  check(/challenge trees too/.test($("#fMsg").textContent), "challenge completion message");
  // LCWC
  check(/Word 1 of 4 · Round 1/.test($("#lcRound").textContent), "LCWC counter");
  check($$("#resBody td").filter((t,i)=>i%3===0).every(t => /^Word \d$/.test(t.textContent)), "results table hides spellings before checking");
  click($("#coverBtn"));
  check($("#lcWord").getAttribute("aria-hidden") === "true", "covered word is aria-hidden");
  type(w, $("#lcIn"), "responsability"); click($("#lcCheck"));
  check(!/responsibility/.test($("#lcMsg").textContent), "visible feedback doesn't name the target word");
  for (let i = 1; i < 8; i++) { click($("#lcNext")); const wd = $("#lcWord").textContent; click($("#coverBtn")); type(w, $("#lcIn"), wd); key(w, $("#lcIn"), "Enter"); }
  click($("#challengeBtn"));
  check($("#lcWord").textContent === "adolescence" && /Word 5 of 6/.test($("#lcRound").textContent), "challenge words continue at the end");
  sectionEndsWithEvidence(d, ["briefing", "tree", "lcwc", "closed"]);
  await new Promise(r => setTimeout(r, 200));
  check(errors.length === 0, "zero console/page errors " + (errors.length ? JSON.stringify(errors) : ""));
  done();
})();
