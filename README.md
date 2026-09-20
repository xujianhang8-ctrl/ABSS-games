# ABSS Buddhism Class Game Hub

A small, offline, browser-based set of games for a weekly Buddhism class
(ages 9-12, ~10-15 students, one shared screen/projector). Split the class
into 2-4 teams and play for 30-40 minutes.

## How to run it

No installation, no internet connection, no build step required.

- **Simplest:** double-click `index.html` to open it in a browser.
- **Recommended for class:** serve the folder so relative links behave
  consistently, e.g. from this folder run `python3 -m http.server 8000`
  and open `http://localhost:8000` on the classroom laptop, then project it.

## What's included

- **`index.html`** — the hub/menu to launch any game.
- **`scoreboard.html`** — set up team names/colors before class, or switch
  to "Big Display Mode" to show final scores at the end. A scoreboard bar
  is pinned to the bottom of every game so you can award points anywhere.
- **`quiz.html`** — a Jeopardy-style board (4 categories × 5 point values)
  covering Buddha's life and core teachings.
- **`truefalse.html`** — a fast true/false lightning round; teams shout an
  answer, click the one they agree on.
- **`timeline.html`** — students place 10 key events of Buddha's life in
  order; checks the order and shows a short note for each event.
- **`wheel.html`** — a spinning wheel to randomly pick a team/turn order,
  or hand out a bonus (editable list, plus presets for teams and bonuses).

Team scores are shared across all games (saved in the browser's local
storage), so points earned in the quiz carry over into the true/false round,
timeline, etc.

## Saving & the in-game menu

Every page has a **☰ menu button** in the top-right corner with:

- **Resume** — close the menu and keep playing.
- **Restart This Game** — clears just that game's progress (useful if a
  team wants a do-over, or you're starting a fresh round).
- **Game Hub** / **Scoreboard** — quick navigation.
- **Save to File** — downloads a `.json` save file with your teams, scores,
  and progress in every game.
- **Load From File** — restores teams/scores/progress from a save file you
  downloaded earlier (handy for moving to a different computer, or backing
  up before the school year ends).
- **Reset Everything** — wipes all teams, scores, and progress to start
  completely fresh.

Progress is saved automatically in the browser as you play (using
`localStorage`), so closing the tab or refreshing mid-game won't lose your
place — the quiz board remembers which questions were used, the true/false
round remembers which statement you're on, and the timeline remembers your
current arrangement.

On the hub (`index.html`), each game card shows a small badge (e.g. "3/20
played", "In progress", "Completed") so you can see at a glance where you
left off. The **"Start New Weekly Session"** button on the hub clears every
game's progress for a clean board next week, while keeping your team names,
colors, and scores intact. The hub also has its own **Save to File** /
**Load From File** buttons, identical to the ones in the in-game menu.

## Customizing content for future weeks

All question/content banks are plain JS data files, easy to edit without
touching any game logic:

- `data/quiz-data.js` — quiz categories and questions
- `data/truefalse-data.js` — true/false statements
- `data/timeline-data.js` — timeline events (order matters — this is the
  "correct" answer key)

Just open the file, edit the text between the quotes, save, and refresh
the browser — no build step needed.
