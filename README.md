# Canvas Assignment Scraper

This script reads a saved copy of your Canvas assignments page and prints each assignment in the terminal. That is all it does.

## The rules this project follows

- Only JSDOM and jQuery are used in the JavaScript.
- No UI.
- No JSON.
- Output is printed in the terminal only.

## How it works, in plain words

1. You save the Canvas assignments page as a file called `dom.html`.
2. The script opens that file with JSDOM, which pretends to be a browser in the background.
3. jQuery looks through the page and finds every assignment.
4. For each assignment, the script prints the name, due date, status and link.

The script never connects to Canvas and never needs your password or token. It only reads the file you give it.

## What you need

- Node.js. It was tested on Node 22.22.2, and the JSDOM version used here supports Node 26 as well.
- A file named `dom.html` in the same folder as `scraper.js`.

## Setup

Open a terminal in this folder and run this once:

```
npm install
```

## How to get dom.html

Do not use "View Page Source" or Ctrl+S. Canvas builds the assignment list with JavaScript after the page opens, so those methods can give you an empty page. Copy the finished page instead:

1. Log in to Canvas and open the course Assignments page.
2. Wait until all assignments are visible on the screen.
3. Right click on the page and choose Inspect.
4. In the Elements tab, right click the very first tag, `<html>`.
5. Choose Copy, then Copy outerHTML.
6. Paste everything into a file named `dom.html` in this folder and save it.

Do this again whenever you want fresh results. The script only knows what was on the page when you copied it.

## Run it

```
npm install jsdom jquery
node scraper.js
```

You can also use `npm start`.

## What you will see

```
Name: Regex Onboarding Hackathon
Due date: 11/09/2026
Status: Past due
Link: https://alueducation.instructure.com/courses/3130/assignments/46805

Name: Roll Call Attendance
Due date: No due date
Status: Active
Link: https://alueducation.instructure.com/courses/3130/assignments/46811
```

## How the status is decided

- If the due date has not passed yet, the status is **Active**.
- If the due date has passed, the status is **Past due**.
- If an assignment has no due date, it shows **No due date** and the status is **Active**, because it cannot be late if nothing is due. To change that word, edit `let status = 'Active';` in `scraper.js`.

The status only compares the due date to today. It does not check whether you already submitted the work. Due dates use Rwanda time (Africa/Kigali) in the format dd/mm/yyyy.

If an assignment has no link, the script prints `No link available`.

## Files

| File | What it is | Edit it? |
| --- | --- | --- |
| `scraper.js` | The script you run | Yes |
| `dom.html` | The saved Canvas page you provide | Replace it when you want fresh data |
| `package.json` | Lists the two libraries and the start command | Rarely |
| `package-lock.json` | Created by npm | No |

Keep file names lowercase with no spaces. If you rename `scraper.js`, also update `"main"` and `"start"` in `package.json`.

## If something goes wrong

**`dom.html was not found`**
The file is missing or in another folder. Put it next to `scraper.js`.

**`No assignments found`**
The copied page has no assignment list in it. Copy the page again using the steps above, with the assignments visible on screen.

**`Cannot find module 'jsdom'` or `'jquery'`**
Run `npm install` in this folder.

**The statuses look out of date**
Your `dom.html` is old, or the due dates have passed since you ran the script. Copy the page again and rerun.

**Nothing prints after Canvas changed its design**
The script looks for `li.assignment`, `a.ig-title` and `.assignment-date-due time`. If your school changes its Canvas layout, these names may need updating in `scraper.js`.
