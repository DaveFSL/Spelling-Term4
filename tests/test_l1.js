const { load, check, click, type, key, staticChecks, sectionEndsWithEvidence, done } = require("./harness");
const FILE = "Wk1_Lesson1_Poets_Toolbox.html";
console.log("== " + FILE);
staticChecks(FILE);
const { w, d, errors } = load(FILE);
const $ = s => d.querySelector(s), $$ = s => [...d.querySelectorAll(s)];

// Warm-up
check($$(".q").length === 5, "5 warm-up questions");
check($("#jumpFix").disabled, "jump-to-fix disabled at start");
click($$("#q0 .opt")[0]); // correct
check($("#score").textContent === "1", "correct answer scores");
click($$("#q1 .opt")[0]); // wrong
check($("#fix1").classList.contains("show"), "wrong answer reveals fix-up");
check(!$("#jumpFix").disabled, "jump-to-fix enabled after a wrong answer");
click($$("#q1 .opt")[1]);
check($("#score").textContent === "1", "question locks after first answer");
click($("#jumpFix"));
check(d.activeElement === $("#fix1"), "jump focuses first fix-up");
check($$(".q .opt").every(b => b.tagName === "BUTTON"), "quiz options are real buttons");

// Teaching cards
check($$("#casenotes .card").length === 8, "8 teaching cards");
check($$("#casenotes .remember").length === 8, "each card has a Remember line");

// Toolbox
const lines = $$(".line-btn");
check(lines.length === 6, "6 poem lines");
check($("#inspector").hidden, "inspector hidden until a line is tapped");
click(lines[0]); // alliteration
check(!$("#inspector").hidden, "tapping a line opens inspector");
click($('#toolChoices [data-tool="simile"]'));
check($("#toolFix").classList.contains("show") && /like|as/.test($("#toolFix").textContent), "wrong tool shows informative fix-up");
check(!$("#step2").classList.contains("show"), "spelling step stays hidden after wrong tool");
click($('#toolChoices [data-tool="alliteration"]'));
check($("#step2").classList.contains("show"), "right tool reveals spelling step");
type(w, $("#spellIn"), "aliteration");
click($("#fileBtn"));
check($("#spellFix").classList.contains("show") && /double l/.test($("#spellFix").textContent), "misspelling shows tricky-part tip");
check($("#peekBtn").hidden, "peek hidden after 1 wrong try");
type(w, $("#spellIn"), "alliterasion");
key(w, $("#spellIn"), "Enter");
check(!$("#peekBtn").hidden, "peek offered after 2 wrong tries");
click($("#peekBtn"));
check($("#peek").textContent === "alliteration", "peek shows the word");
type(w, $("#spellIn"), "Alliteration ");
click($("#fileBtn"));
check(lines[0].classList.contains("solved") && lines[0].querySelector("mark"), "correct spelling files the line and marks evidence");
check(lines[0].querySelector(".badge").textContent === "filed ✓", "filed badge hides the tool name until the case is solved");
check($("#toolCount").textContent.startsWith("1 of 6"), "progress counter updates");
click(lines[0]);
check($("#inspector").hidden && /already filed/.test($("#toolMsg").textContent), "solved line can't be reopened");
// solve the rest
const answers = ["alliteration", "simile", "metaphor", "simile", "metaphor", "alliteration"];
for (let i = 1; i < 6; i++) {
  click(lines[i]);
  click($(`#toolChoices [data-tool="${answers[i]}"]`));
  type(w, $("#spellIn"), answers[i]);
  click($("#fileBtn"));
}
check($$(".line-btn.solved").length === 6, "all six lines can be filed");
check(/Case solved/.test($("#toolMsg").textContent), "completion message shown");
check(/alliteration ✓/.test(lines[0].querySelector(".badge").textContent), "tool names revealed once all six are filed");

// Writing
check($("#exampleBtn").disabled, "worked example locked at start");
click($("#exampleBtn"));
check(!$("#exampleBox").classList.contains("show"), "locked example cannot be opened");
click($("#helpBtn"));
check($("#helpBox").classList.contains("show") && $("#helpBtn").getAttribute("aria-expanded") === "true", "I need help opens scaffold");
click($$("#helpBox .wb")[0]);
check(/simile/.test($("#writebox").value), "word bank chip inserts word");
type(w, $("#writebox"), "A simile compares using like. A metaphor says it is.");
check(!$("#exampleBtn").disabled, "example unlocks after an attempt");
check($("#spy").textContent.indexOf("Focus words spelt correctly: 2") !== -1, "spelling spy counts words spelt correctly");
check($('#spy .chip[data-word="simile"]').classList.contains("on") && $('#spy .chip[data-word="metaphor"]').classList.contains("on"), "spelling spy lights correctly spelt words");
check(!$('#spy .chip[data-word="rhythm"]'), "spelling spy ignores words not used");
click($("#exampleBtn"));
check($("#exampleBox").classList.contains("show"), "example reveals after unlock");

// Close
click($$("#confi button")[2]);
check($$("#confi button")[2].getAttribute("aria-pressed") === "true", "confidence toggles");
sectionEndsWithEvidence(d, ["briefing", "toolbox", "explain", "closed"]);
check($(".home-link").getAttribute("href") === "index.html", "home link to unit hub");

setTimeout(() => { check(errors.length === 0, "zero console/page errors " + (errors.length ? JSON.stringify(errors) : "")); done(); }, 2300);
