# Website Preference Builder

## Purpose

Free mockup request page that helps potential clients choose website preferences and request a quick screenshot-style concept before a consultation.

## Current Implementation

- English page: `preference-builder.html`
- Spanish page: `es/preference-builder.html`
- Linked from the main Services page gateway in both languages.
- Linked from the Custom Business Web Apps page in both languages.
- Linked from the shared floating process rail Design step in both languages.
- Linked from the Process and Website Design pages in desktop and mobile layouts.
- Uses the standard Dark Matter site shell: desktop Services dropdown, mobile language header, mobile Services popout support, bottom mobile tab bar, powered-by badge, and footer.
- Lets users choose:
  - Visual style
  - Industry / structure direction
  - Primary goal
  - Page blueprint options
  - Brand voice / brand soul notes
- Shows a live blueprint summary and progress indicator.
- Frames the offer as a free website mockup idea with a direct follow-up within 48 hours.
- Uses a lightweight tinted hero treatment with the live blueprint card; the MP4 hero is no longer loaded on this page.
- Hero includes a down-arrow cue that directs visitors to fill out the form below.
- Uses Netlify Forms with form name `website-preferences`.
- Hidden fields stay synced with selected visual style, industry, primary goal, brand voice, page options, and language.
- Bottom panel collects contact name, email, and optional phone; the submit button stays visually live and prompts users if required choices are missing.
- Submits with URL-encoded AJAX to `/`, matching Netlify Forms requirements while keeping the user on the page.
- Includes a honeypot field for spam reduction.
- Main intake sections are arranged as a vertical step-by-step flow.
- Visual preference choices use a consistent mini-website preview style with different aesthetic treatments.
- Top summary card is a progress/status panel, not a submit CTA.
- Bottom section contains the live submit/review panel.
- Step sections use a stronger panel background, colored border, and shadow to stand apart from the grid background.

## Source Notes

Initial concept came from the temporary `to-do/` prototype files:

- `DESIGN.md`: Synthetic Flux style guidance and component notes.
- `designpref.txt`: HTML prototype for a website preference onboarding flow.
- `screen.png`: unusable placeholder file containing only a failed-image message.

The temporary `to-do/` folder was cleared after the useful design and structure ideas were integrated.

## Future Ideas

- Verify deployed Netlify form detection and notification delivery after the next production deploy.
- Add admin/internal email formatting for selected preferences if Netlify's default email layout is not enough.
- Consider a printable/shareable project brief output.
