const { load, check, click, type, key, staticChecks, sectionEndsWithEvidence, done } = require("./harness");
const FILE = "Wk2_Lesson1_Mission_Match.html";
console.log("== " + FILE);
staticChecks(FILE);
const { w, d, errors } = load(FILE);
const $ = s => d.querySelector(s), $$ = s => [...d.querySelectorAll(s)];
check($$(".q").length === 5, "5 warm-up questions");
click($$("#q0 .opt")[0]); check($("#fix0").classList.contains("show") && !$("#jumpFix").disabled, "wrong warm-up → fix-up + jump enabled");
check($$("#casenotes .card").length === 4 && $$("#casenotes .remember").length === 4, "4 teaching cards with Remember lines");
check($$("nav.pills a").every(a => d.getElementById(a.getAttribute("href").slice(1))), "nav pills point at real sections");
const tiles = () => $$(".wtile"), slots = () => $$(".slot");
check(tiles().length === 8 && slots().length === 8, "8 tiles and 8 slots");
click(slots()[0]);
check(/Pick a word/.test($("#matchMsg").textContent), "tapping a slot first gives guidance");
const tileFor = w => tiles().find(t => t.dataset.word === w);
// wrong via keyboard pick
key(w, tileFor("charity"), "Enter");
check(tileFor("charity").classList.contains("picked") && tileFor("charity").getAttribute("aria-pressed") === "true", "Enter picks a tile (aria-pressed)");
click(slots()[0]); // compassion scene
check(/Not “charity”/.test($("#matchMsg").textContent) && /noticing someone is hurting/.test($("#matchMsg").textContent), "wrong match explains both word and scene");
check(!$("#scene0").classList.contains("right") && !tileFor("charity").disabled, "wrong tile stays available");
click($("#matchHint"));
check(/starts with “co”/.test($("#matchMsg").textContent) && d.activeElement === slots()[0], "hint names first letters and focuses the slot");
const ORDER = ["compassion","charity","generosity","justice","dignity","community","volunteer","solidarity"];
ORDER.forEach((wd, i) => { key(w, tileFor(wd), "Enter"); click(slots()[i]); });
check($$(".scene.right").length === 8 && /All eight matched/.test($("#matchMsg").textContent), "all 8 can be matched");
check(tiles().every(t => t.disabled) && slots().every(s => s.disabled), "used tiles/slots leave the tab order");
// writing
check($("#exampleBtn").disabled, "worked example locked");
type(w, $("#writebox"), "Let's show compassion and generosity today.");
check(!$("#exampleBtn").disabled && $('#spy .chip[data-word="generosity"]').classList.contains("on"), "attempt unlocks example; spy works");
check(!$('#spy .chip[data-word="justice"]'), "spy ignores unused words");
click($("#helpBtn")); check($("#helpBox").classList.contains("show"), "help opens");
click($("#exampleBtn")); check($("#exampleBox").classList.contains("show"), "example shows");
check($$(".check-list label").length === 3, "exit checklist uses full-row labels");
click($$("#confi button")[0]); check($$("#confi button")[0].getAttribute("aria-pressed") === "true", "confidence toggles");
sectionEndsWithEvidence(d, ["briefing", "match", "leader", "closed"]);
setTimeout(() => { check(errors.length === 0, "zero console/page errors " + (errors.length ? JSON.stringify(errors) : "")); done(); }, 800);
