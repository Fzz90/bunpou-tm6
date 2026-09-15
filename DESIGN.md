# Bunpou — design direction

## Brief
Six presentation slides in Indonesian for Faiz Syihab, NIM 125241046, Kelas A. Teach ～ております and ～でございます, including meaning, construction, examples, and progressively demanding exercises. Prepare print styles now; PDF export remains a future action. Publish the static site through GitHub Pages from `Fzz90/bunpou-tm6`.

## Visual system
- Ink `#292743`: readable text and quiet controls.
- Cobalt `#4444DE`: Japanese display type and primary actions.
- Lavender `#ECECF6`: slide canvas.
- Lilac `#CDC4ED`: folded paper illustration and secondary surfaces.
- Citron `#E2EDAB`: short callouts and formula endings.
- White `#FFFFFF`: reading surfaces.
- Type: Gentium Book Plus for Indonesian display/body; Huninn for Japanese. Google Fonts import, with Georgia and Yu Gothic / Meiryo fallbacks.
- Layout: a 16:9 stage, generous left-aligned type, different composition for each lesson, quiet navigation outside the slide. Below 900px, slides reflow as readable pages.

```
Cover:    [ Japanese grammar title       ][ folded-paper rosette ]
          [ presenter details           ][ start                ]
Meaning:  [ action panel                  | identity panel       ]
Formula:  [ heading ][ verb construction  | noun / na-adjective  ]
Examples: [ intro   ][ four contextual examples in two columns   ]
Practice: [ large worksheet with four numbered transformation rows ]
Closing:  [ folded motif ][ thank-you statement ][ presenter      ]
```

## Design review before implementation
Use the Japanese grammar itself as the cover's visual anchor. Avoid dashboard cards, decorative gradients, stock temple imagery, and generic landing-page sections. The folded-paper rosette references deliberate care in presentation; repeated petals are one coherent illustration. Use distinct cobalt and citron fields to explain action vs. identity. Keep motion to the initial paper unfold, slide transitions, and responses to user actions. Do not continuously rotate the illustration.

## Interaction and print
- Six slide buttons; previous/next; arrow keys; Home/End; F for fullscreen.
- Four transformation rows progress from one noun pattern to a final sentence combining both patterns, without difficulty labels.
- First next action reveals five answers in sequence; second next action advances to the closing slide. Previous hides the answers before leaving the worksheet.
- Reduced-motion preference, semantic headings, visible focus, and labeled controls.
- Print CSS shows all six slides at 320mm × 180mm, hides navigation and answer reveals, and prints every exercise. No PDF generated or repository published during this task.
