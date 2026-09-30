// Shared jsdom loader for lesson tests
const { JSDOM, VirtualConsole } = require("jsdom");
const fs = require("fs");
const path = require("path");

function load(file) {
  const html = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
  const errors = [];
  const vc = new VirtualConsole();
  vc.on("error", e => errors.push(String(e)));
  vc.on("jsdomError", e => { if (!/Could not load link|fonts\.g/i.test(String(e.message || e))) errors.push("jsdomError: " + (e.message || e)); });
  const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: vc, url: "http://localhost/" + file });
  const w = dom.window;
  w.HTMLElement.prototype.scrollIntoView = function () {};
  w.onerror = (m) => errors.push("onerror: " + m);
  return { dom, w, d: w.document, errors };
}
let failures = 0;
function check(cond, label) {
  if (cond) console.log("  ok   " + label);
  else { failures++; console.log("  FAIL " + label); }
}
function click(el) { el.dispatchEvent(new el.ownerDocument.defaultView.MouseEvent("click", { bubbles: true })); }
function type(w, el, val) { el.value = val; el.dispatchEvent(new w.Event("input", { bubbles: true })); }
function key(w, el, k) { el.dispatchEvent(new w.KeyboardEvent("keydown", { key: k, bubbles: true })); }
function staticChecks(file) {
  const html = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
  const ext = [...html.matchAll(/(?:src|href)=["'](https?:[^"']+)/g)].map(m => m[1]);
  check(ext.every(u => /fonts\.(googleapis|gstatic)\.com/.test(u)), "only external refs are Google Fonts (" + ext.length + ")");
  check(!/localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest/.test(html), "no storage / network APIs");
  check(!/<img\b/i.test(html), "no bitmap <img> tags");
  check(/\[hidden\]\{display:none !important\}/.test(html), "[hidden] elements are forced hidden (display rules can't override)");
  const svgs = [...html.matchAll(/<svg\b[^>]*>/g)].map(m => m[0]);
  check(svgs.every(s => /aria-label=|aria-hidden="true"/.test(s)), "every SVG has aria-label or aria-hidden");
}
function sectionEndsWithEvidence(d, ids) {
  ids.forEach(id => {
    const sec = d.getElementById(id);
    check(sec && sec.querySelector(".evidence"), "section #" + id + " has a screenshot callout");
  });
}
module.exports = { load, check, click, type, key, staticChecks, sectionEndsWithEvidence, done: () => { console.log(failures ? "\n" + failures + " FAILURE(S)" : "\nALL PASSED"); process.exitCode = failures ? 1 : 0; } };
