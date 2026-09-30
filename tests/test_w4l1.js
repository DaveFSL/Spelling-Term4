const { load, check, click, type, staticChecks, sectionEndsWithEvidence, done } = require("./harness");
const FILE = "Wk4_Lesson1_Ad_Inspector.html";
console.log("== " + FILE);
staticChecks(FILE);
const { w, d, errors } = load(FILE);
const $ = s => d.querySelector(s), $$ = s => [...d.querySelectorAll(s)];
(async () => {
  check($$(".q").length === 5, "5 warm-up questions");
  click($$("#q0 .opt")[1]); check(d.activeElement === $("#fix0"), "wrong answer focuses the fix-up");
  check($$("#casenotes .remember").length === 4, "4 teaching cards with Remember lines");
  check($$("nav.pills a[href^='#']").every(a => d.getElementById(a.getAttribute("href").slice(1))), "nav pills point at real sections");
  const ids = $$("[id]").map(e => e.id); check(new Set(ids).size === ids.length, "no duplicate ids");
  // Ad inspector
  const ph = $$(".phrase");
  check(ph.length === 10, "10 ad phrases");
  check($("#adCheck").disabled, "check locked until something is highlighted");
  const pens = {}; $$(".pen").forEach(p => pens[p.dataset.pen] = p);
  click(pens.band); click(ph[0]);
  check(ph[0].classList.contains("hl-band") && /highlighted as/.test(ph[0].getAttribute("aria-label")), "highlight applies colour + aria label");
  check(!$("#adCheck").disabled, "check unlocks");
  click(ph[2]); // a fact wrongly highlighted
  click($("#adCheck"));
  check($("#adFix").classList.contains("show") && d.activeElement === $("#adFix"), "partial answer shows focused fix-up");
  check(/Available in sizes/.test($("#adFix").textContent) && /eraser/i.test($("#adFix").textContent), "fix-up names the wrongly highlighted fact");
  check(ph[0].classList.contains("ok") && ph[2].classList.contains("no"), "lines marked ok / no");
  click(pens.erase); click(ph[2]);
  const key = { 0:"band",1:"exag",3:"cool",4:"rush",6:"band",7:"exag",8:"rush" };
  Object.entries(key).forEach(([i,k]) => { click(pens[k]); click(ph[+i]); });
  click($("#adCheck"));
  check(/Case cracked/.test($("#adMsg").textContent) && !$("#adFix").classList.contains("show"), "all correct → success message");
  click($("#adHint")); check(/7 tricks and 3 facts/.test($("#adFix").textContent), "hint available");
  // writing
  check($("#exampleBtn").disabled, "worked example locked");
  type(w, $("#writebox"), "Before you purchase, check it is a necessity and keep the reciept.");
  check($("#spy .spy-count").textContent === "2", "Spy counts only correct spellings");
  check(!$("#exampleBtn").disabled, "example unlocks after writing");
  sectionEndsWithEvidence(d, ["briefing", "inspector", "shopper", "closed"]);
  await new Promise(r => setTimeout(r, 200));
  check(errors.length === 0, "zero console/page errors " + (errors.length ? JSON.stringify(errors) : ""));
  done();
})();
