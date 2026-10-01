# Word Detectives: Term 4 Casebook

Year 6 spelling unit, Term 4 2026, St Joseph's Primary School, Corinda.
5 weeks × 3 lessons (20 min each), plus one final review lesson, for 16 interactive HTML lessons in total.

**Master plan:** `Year6_Spelling_Unit_Term4_2026.docx`. It uses the school template and is the single source of truth for word lists, learning intentions, activities and dictation sentences.

**Unit hub:** `index.html` lists all 16 lessons. Built lessons link through, and unbuilt ones show a **Coming soon** card that isn't clickable.
- To release a lesson, change its `status` from `"soon"` to `"live"` in the `CASES` array near the bottom of `index.html`.
- Every lesson links back to the hub from its header ("← Term 4 Casebook home").

## Lesson roster

| # | Week / theme | File | Signature interactive | Status |
|---|---|---|---|---|
| 1 | Wk1 Poetry | `Wk1_Lesson1_Poets_Toolbox.html` | Tap a poem line to reveal and name its device | Built |
| 2 | Wk1 Poetry | `Wk1_Lesson2_Beat_Tapper.html` | Tap syllable beats, then unlock the origin card | Built |
| 3 | Wk1 Poetry | `Wk1_Lesson3_Stanza_Repair.html` | Find and fix 6 misspelt words in an original verse | Built |
| 4 | Wk2 Catholic Mission | `Wk2_Lesson1_Mission_Match.html` | Drag words onto Mission Day scenarios | Built |
| 5 | Wk2 Catholic Mission | `Wk2_Lesson2_Suffix_Machine.html` | Predict the output of base word + suffix | Built |
| 6 | Wk2 Catholic Mission | `Wk2_Lesson3_Poster_Press.html` | Poster slots that only "print" when spelt correctly | Built |
| 7 | Wk3 Science changes | `Wk3_Lesson1_Change_Sort.html` | Drag changes into reversible or irreversible beakers | Built |
| 8 | Wk3 Science changes | `Wk3_Lesson2_Prefix_Lab.html` | Click-to-build prefix + root + suffix | Built |
| 9 | Wk3 Science changes | `Wk3_Lesson3_Melt_and_Rebuild.html` | Word melts away, then rebuild it from memory | Built |
| 10 | Wk4 HASS consumer | `Wk4_Lesson1_Ad_Inspector.html` | Highlight persuasive tricks in an original ad | Built |
| 11 | Wk4 HASS consumer | `Wk4_Lesson2_Silent_Letter_Scanner.html` | Slide a scanner and stop on the silent letter | Built |
| 12 | Wk4 HASS consumer | `Wk4_Lesson3_Budget_Cart.html` | Spell an item correctly to add it to the cart, within budget | Built |
| 13 | Wk5 Transition | `Wk5_Lesson1_Timetable_Builder.html` | Drag words into a Year 7 day planner | Built |
| 14 | Wk5 Transition | `Wk5_Lesson2_Word_Family_Tree.html` | Grow -ent/-ence and -ant/-ance branches | Built |
| 15 | Wk5 Transition | `Wk5_Lesson3_Letter_to_Year7_Me.html` | Letter with a live word check and a proofreader that flags slips without giving answers | Built |
| 16 | Review | `Review_Lesson16_Case_Closed.html` | Case Board: solve 5 case files to earn stamps | Built |

## Tests

`tests/` holds jsdom harnesses for the hub and each built lesson. Run them from inside `tests/`:

```
npm install
npm test
```

Each harness checks the following:
- The correct and wrong paths through every interactive, the locked-until-attempted gates and the "I need help" scaffolds.
- The screenshot callouts, and that the only external reference is Google Fonts.
- That there are zero console errors.
- For Lesson 3, the dictation sentences are also compared byte-for-byte with the unit plan (`tests/dictation_w1.json`).

Re-run the tests after any edit.

## Curriculum

- **Spine:** AC9E6LY08 and AC9E6LY09.
- **Science:** AC9S6U04 (Wk3).
- **HASS:** AC9HS6K08 (Wk4).
- **HPE:** AC9HP6P02 (Wk5).

## Non-negotiables

- **One file per lesson:** each lesson is one standalone `.html` with all CSS and JS inline. The only external reference is Google Fonts. It must work offline and on GitHub Pages.
- **No saving:** no localStorage, sessionStorage or backend. Every response or interactive section ends with a screenshot-to-OneNote callout.
- **Devices:** it must be responsive for student laptops and the teacher iPad, with tap targets of at least 40px.
- **Accessibility:** use real `<button>`s, aria-labels on visuals, keyboard-operable interactives and `:focus-visible` outlines.
- **Original content only:** no copyrighted text, images or media. Paterson excerpts are short and public domain. Dan Davies' poem is not reproduced.
- **Phonology:** teach it in Session 2 lessons only.
- **Interactives:** each lesson has a distinct signature interactive, with no back-to-back repeats.
- **Dictation:** sentences must match the unit plan byte-for-byte, including curly quotes, en dashes and apostrophes.
- **No retrofitting:** don't change completed lessons, and don't rename files (Dave renames).

## House style

- **Fonts:** Space Grotesk for headings; Atkinson Hyperlegible for body text (dyslexia-friendly).
- **Colours:**
  - Paper `#fbf9f4`, navy ink `#1b2a4a`, amber `#e8930c`, teal `#0e7c7b`.
  - Cards are white, with soft borders and subtle shadows.
- **Header:** a dark navy header band containing an uppercase eyebrow, a big title and a one-line hook, with sticky section-nav pills below it.
- **Diagrams:** inline SVG only, never bitmaps.

## Lesson structure (20 min)

1. **Warm-up quiz (3 min):**
   - Multiple choice with instant feedback.
   - An orange fix-up note that names the error and the fix.
   - A running score and a "jump to my first fix-up" button.
2. **Teaching cards (5 min):** one idea per card, each with an SVG visual and one "Remember:" line.
3. **Signature interactive (7 min):**
   - Students do or test rather than read.
   - Unlimited retries and hints.
   - Wrong attempts are informative, not punishing.
4. **Independent task (5 min):**
   - Locked until the student makes an attempt.
   - Opt-in "I need help" sentence starters or cloze.
   - Exit checklist of evidence, and a screenshot callout.

Session 3 lessons also carry the weekly 8-word dictation. Lesson 16 carries a 10-word cumulative dictation.

Tone: friendly, student-facing and lightly themed, using the Word Detectives case-file motif. Support and extension sit in the same page.

## Build and test workflow

1. Write the standalone HTML.
2. Extract the inline JS and run `node --check`.
3. Write a jsdom harness that tests the correct and wrong paths through every interactive, plus the writing lock. It must reach zero console errors.
4. Optionally render the SVGs to check the layout.
5. Confirm that Google Fonts is the only external reference.
