# FeelDx — Materials & Furniture Selection Assistant

This is my submission for the FeelDX practical exercise. It's a room design selection tool where users can pick a room type, choose materials and furniture, and generate a mock AI summary based on their selections.

---

## Project Overview

The app follows the 3-step flow from the brief:

1. **Choose Room** — select from Kitchen, Bathroom, Living Room, Bedroom, or Laundry
2. **Select Materials** — pick from a list of mock materials and furniture options for that room
3. **Generate AI Summary** — get a mocked summary covering cost estimate, missing selections, design notes, and recommended next steps

The selection summary on the right updates in real time as you make choices. Each room has its own set of categories so the missing selections list is always relevant to the room you're working on.

---

## Technologies Used

1. **React JS**
2. **Redux Toolkit**
3. **React-Redux**
4. **Vite**
5. **Tailwind CSS**
6. **DaisyUI**
7. **HeroIcons**
8. **Sass**

---

## Setup Instructions

Make sure you have Node.js installed, then run:

```bash
npm install
```

---

## Running the Application Locally

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

```bash
npm run build    # build for production
```

---

## How It Works

I used Redux to manage the shared state across components — the selected room, the current material selections, and whether the AI summary has been generated. This made it straightforward to keep the Selection Summary and AI panel in sync without prop drilling.

Each room has its own category list (e.g. Kitchen uses Benchtop and Cabinetry, while Living Room uses Sofa and Coffee Table). Missing selections are worked out by comparing what's been picked against that room's full list.

The budget estimate checks which cost tier — `$`, `$$`, or `$$$` — has the most selected items and uses that as the overall estimate. I made sure both the Selection Summary and the AI panel use the same calculation so they always show the same result.

The AI logic is rule-based. Each rule checks the current selection map and returns a message if the condition is met — things like a dark room warning when multiple dark finishes are chosen, or a marble maintenance note when any marble option is selected. Rules are typed as either a warning or an insight so they can be grouped differently in the output.

---

## Assumptions

- No real AI API was used — the summary is fully mocked with rule-based logic as the brief suggested.
- I assumed each room would have 5 categories, so the "X of 5" counter is hardcoded to that.
- Switching rooms resets all selections, which felt like the expected behaviour for this kind of tool.
- Cost values are simple integers: 1 = budget, 2 = mid-range, 3 = premium.

---

## Testing

No automated tests are included. To manually check the main flows:

**Selections**
1. Open `http://localhost:5173`
2. Click a room — the progress bar should move to step 2
3. Select a few materials — the right panel should update straight away
4. Click a selected material again to deselect it — it should disappear from the summary
5. Switch rooms — everything should reset

**AI Summary**
1. Pick at least one material and click **Generate AI Summary**
2. A loading indicator appears briefly, then the summary shows
3. The cost label in the AI Analysis should match the Budget Estimate in the Selection Summary
4. Missing Selections should only list categories you haven't filled in yet
5. The progress bar should complete to step 3

---

## Limitations

- No backend and no third-party API — everything runs client-side and the AI summary is fully mocked with rule-based logic.
- The AI is hardcoded. Hooking into a real API like Claude or GPT would make the summaries much more dynamic.
- Mobile layout is functional but I'd want to spend more time on the smaller breakpoints before calling it polished.
- No saved designs or user accounts, but that felt out of scope for the exercise.
