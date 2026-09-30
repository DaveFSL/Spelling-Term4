const { load, check, click, type, key, staticChecks, sectionEndsWithEvidence, done } = require("./harness");
const FILE = "Wk1_Lesson3_Stanza_Repair.html";
console.log("== " + FILE);
staticChecks(FILE);
const { w, d, errors } = load(FILE);
const $ = s => d.querySelector(s), $$ = s => [...d.querySelectorAll(s)];
check($$(".q").length === 5, "5 warm-up questions");
click($$("#q0 .opt")[1]); check($("#score").textContent === "1", "correct warm-up answer scores");
click($$("#q1 .opt")[0]); check($("#fix1").classList.contains("show"), "wrong warm-up answer shows fix-up");
check($$("#casenotes .remember").length === 2, "2 teaching cards with Remember lines");
// nav targets exist
check($$("nav.pills a[href^='#']").every(a => d.getElementById(a.getAttribute("href").slice(1))), "every nav pill points at a real section");

// Stanza repair
const toks = $$(".tok");
check(toks.length > 60, "verse rendered as tappable word buttons (" + toks.length + ")");
const stanza = toks.find(t => t.dataset.word === "stanza");
click(stanza);
check(/spelt correctly/.test($("#repMsg").textContent) && $("#repairBox").hidden, "tapping a correct word explains, no repair box");
const bad = ["rythm", "ryme", "poitry", "simily", "metafor", "aliteration"];
check(bad.every(b => toks.some(t => t.dataset.word === b)), "all six mistakes are tappable");
const r1 = toks.find(t => t.dataset.word === "rythm");
click(r1);
check(!$("#repairBox").hidden && $("#repWord").textContent === "rythm", "tapping a mistake opens the repair box");
type(w, $("#repIn"), "rhythem"); click($("#repBtn"));
check($("#repFix").classList.contains("show") && /silent-h/.test($("#repFix").textContent) && !/letters/.test($("#repFix").textContent), "wrong correction → tip, no letter-count yet");
type(w, $("#repIn"), "rythmm"); key(w, $("#repIn"), "Enter");
check(/6 letters/.test($("#repFix").textContent), "second wrong correction adds letter-count hint");
click($("#repCancel"));
check($("#repairBox").hidden, "cancel closes repair box");
click($("#repHint"));
check(/line 2/.test($("#repMsg").textContent) && $("#vl1").classList.contains("flash"), "hint points at the first unfixed line");
const fixes = { rythm: "rhythm", ryme: "rhyme", poitry: "poetry", simily: "simile", metafor: "metaphor", aliteration: "alliteration" };
Object.keys(fixes).forEach(b => {
  const t = $$(".tok").find(x => x.dataset.word === b);
  click(t); type(w, $("#repIn"), fixes[b].toUpperCase()); click($("#repBtn"));
});
check($$(".tok.fixed").length === 6, "all six mistakes can be fixed");
check($$(".tok.fixed")[3].textContent === "simile:", "fix keeps punctuation (simile:)");
check(/Verse repaired/.test($("#repMsg").textContent), "completion message");
click($("#repHint"));
check(/No mistakes left/.test($("#repMsg").textContent), "hint knows when all fixed");

// Writing
check($("#exampleBtn").disabled, "worked example locked");
type(w, $("#writebox"), "The rain kept rhythm on the roof,\na ballad of the bush.");
check(!$("#exampleBtn").disabled && $('#spy .chip[data-word="ballad"]').classList.contains("on"), "attempt unlocks example; spy lights ballad");
click($("#exampleBtn")); check($("#exampleBox").classList.contains("show"), "example shown");

// Dictation
check($("#dictReveal").disabled && $("#dictAnswers").hidden, "dictation answers locked");
click($("#dictReveal")); check($("#dictAnswers").hidden, "locked reveal does nothing");
$("#dictReady").checked = true; $("#dictReady").dispatchEvent(new w.Event("change"));
check(!$("#dictReveal").disabled, "ticking ready unlocks answers");
click($("#dictReveal"));
check(!$("#dictAnswers").hidden && $$("#dictList li").length === 8, "8 dictation answers shown");
const marks = $$(".dmark"); click(marks[0]); click(marks[1]); click(marks[1]); click(marks[4]);
check($("#dictScore").textContent === "2", "self-mark toggles update score");
// exact text vs unit plan
const plan = require("./dictation_w1.json");
const shown = $$("#dictList li").map(li => [li.querySelector(".dword").textContent, li.querySelector(".dsent").textContent]);
check(JSON.stringify(shown) === JSON.stringify(plan), "dictation matches unit plan byte-for-byte");
sectionEndsWithEvidence(d, ["briefing", "repair", "verseWrite", "dictation", "closed"]);
setTimeout(() => { check(errors.length === 0, "zero console/page errors " + (errors.length ? JSON.stringify(errors) : "")); done(); }, 2800);
