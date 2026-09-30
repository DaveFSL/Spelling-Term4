const { load, check, click, type, key, staticChecks, sectionEndsWithEvidence, done } = require("./harness");
const FILE = "Wk1_Lesson2_Beat_Tapper.html";
console.log("== " + FILE);
staticChecks(FILE);
const { w, d, errors } = load(FILE);
const $ = s => d.querySelector(s), $$ = s => [...d.querySelectorAll(s)];
check($$(".q").length === 5, "5 warm-up questions");
click($$("#q2 .opt")[0]);
check($("#fix2").classList.contains("show") && !$("#jumpFix").disabled, "wrong warm-up answer shows fix-up and enables jump");
check($$("#casenotes .card").length === 6 && $$("#casenotes .remember").length === 6, "6 teaching cards with Remember lines");

// Beat tapper
check($("#stage").hidden, "stage hidden until a word is picked");
const picks = $$(".wpick");
check(picks.length === 8, "8 words to tap");
click(picks[0]); // poetry = 3
check(!$("#stage").hidden && $("#stageWord").textContent === "poetry", "picking a word opens the stage");
click($("#checkBeats"));
check(/Tap the drum first/.test($("#beatFix").textContent), "checking with no taps gives guidance");
for (let i = 0; i < 2; i++) click($("#drum"));
check($$("#beats .beat").length === 2, "taps render beat dots");
click($("#checkBeats"));
check(/too few/.test($("#beatFix").textContent) && !/Hint:/.test($("#beatFix").textContent), "too few taps → fix-up, no hint yet");
check($$("#beats .beat").length === 0, "taps reset after a wrong check");
for (let i = 0; i < 4; i++) click($("#drum"));
click($("#checkBeats"));
check(/too many/.test($("#beatFix").textContent) && /Hint:/.test($("#beatFix").textContent), "second wrong try adds a hint");
for (let i = 0; i < 3; i++) click($("#drum"));
click($("#resetBeats"));
check($("#tapCount").textContent === "0 taps", "start again clears taps");
for (let i = 0; i < 3; i++) click($("#drum"));
click($("#checkBeats"));
check($("#origin").classList.contains("show") && /po · e · try/.test($("#origin").textContent), "correct beats unlock origin card with syllable split");
check($("#g0").classList.contains("open") && picks[0].classList.contains("done"), "gallery and picker mark the word done");
const N = [3, 2, 1, 2, 2, 3, 3, 5];
for (let i = 1; i < 8; i++) { click(picks[i]); for (let k = 0; k < N[i]; k++) click($("#drum")); click($("#checkBeats")); }
check($$(".gcard.open").length === 8 && /All eight/.test($("#tapMsg").textContent), "all 8 origin cards unlock");
click(picks[2]);
check($("#origin").classList.contains("show"), "re-picking an unlocked word shows its origin");
check($("#drum").tagName === "BUTTON", "drum is a real button (keyboard operable)");

// LCWC
check($("#lcWord").textContent === "rhythm" && $$("#lcWord .tp").length === 3, "LCWC starts with rhythm and marks tricky part");
check($("#writeArea").hidden, "write area hidden during Look");
check(/Word 1/.test($("#resBody").textContent) && !/rhythm/.test($("#resBody").textContent), "results hide spellings until a word is checked");
click($("#coverBtn"));
check($("#lcCover").classList.contains("show") && !$("#writeArea").hidden, "cover hides word and opens writing");
check($("#lcWord").getAttribute("aria-hidden") === "true", "covered word is hidden from screen readers");
check($("#lcCheck").disabled, "check locked until attempt typed");
click($("#helpBtn"));
check($("#helpBox").classList.contains("show") && /Helps/.test($("#helpBox").textContent), "I need help reveals memory trick");
type(w, $("#lcIn"), "rythm");
check(!$("#lcCheck").disabled, "check unlocks after typing");
click($("#lcCheck"));
check($$("#compare .cl.no").length > 0 && /Not yet/.test($("#lcMsg").textContent), "wrong attempt shows letter comparison");
check($("#lcWord").getAttribute("aria-hidden") !== "true" && /rhythm/.test($("#resBody").textContent) && /✗/.test($("#resBody").textContent), "results table records the miss");
click($("#lcNext"));
check($("#lcWord").textContent === "rhyme", "next word loads");
click($("#coverBtn")); type(w, $("#lcIn"), "rhyme"); key(w, $("#lcIn"), "Enter");
check(/Spot on/.test($("#lcMsg").textContent), "correct attempt confirmed (Enter key)");
check($$("#resBody tr").length === 4, "results table lists 4 words");
// run through the rest
for (let i = 2; i < 8; i++) { click($("#lcNext")); const wd = $("#lcWord").textContent; click($("#coverBtn")); type(w, $("#lcIn"), wd); click($("#lcCheck")); }
check(/Start the rounds again/.test($("#lcNext").textContent), "end of rounds offers restart");
check(/Round 2/.test($("#lcRound").textContent), "round 2 reached");
click($("#challengeBtn"));
check($$("#resBody tr").length === 6 && $("#challengeBtn").disabled, "challenge words extend the list");
click($$("#confi button")[1]);
check($$("#confi button")[1].getAttribute("aria-pressed") === "true", "confidence toggles");
sectionEndsWithEvidence(d, ["briefing", "tapper", "lcwc", "closed"]);
setTimeout(() => { check(errors.length === 0, "zero console/page errors " + (errors.length ? JSON.stringify(errors) : "")); done(); }, 400);
