# Writeup submission form

[`create-share-form.gs`](create-share-form.gs) is a Google Apps Script that creates the "Share your experience" Google Form and a Google Sheet for its responses. The `/share` page links to the form.

It only needs to run once. Running it again creates a second, separate form.

## Create the form

1. Go to [script.google.com](https://script.google.com) while signed in to the Google account that should own the form, and click **New project**.
2. Rename the project (click "Untitled project" at the top), for example to `NextInML share form`.
3. Delete the sample code in `Code.gs`, paste in the whole of `create-share-form.gs`, and save with <kbd>Cmd</kbd>+<kbd>S</kbd> (or <kbd>Ctrl</kbd>+<kbd>S</kbd>).
4. In the toolbar, make sure the function dropdown shows **createShareForm**, then click **Run**.
5. Google asks for permission the first time:
   - Click **Review permissions** and choose your account.
   - You'll see **"Google hasn't verified this app"**. Click **Advanced**, then **Go to NextInML share form (unsafe)**.
   - Click **Allow**. The script asks to manage your forms and spreadsheets, which it needs to create both.

   > [!NOTE]
   > The "unverified" warning appears for any personal script that hasn't been through Google's review. It's your own code running in your own account.

6. When it finishes, the **Execution log** at the bottom prints three links:
   - **Public link**: the one students use. Put this in the site (see below).
   - **Edit the form**: for changing questions later.
   - **Responses sheet**: where submissions arrive.

## Check it before sharing

1. Open the **Edit the form** link and look over the questions.
2. Check the form is published. If there's a **Publish** button in the top right, click it, and under responders choose **Anyone with the link**.
3. Click the eye icon (**Preview**) and send yourself a test submission. It should appear in the responses sheet. Delete the test row afterwards.

> [!IMPORTANT]
> If the form only accepts people in one organisation (common on Google Workspace accounts), students outside it can't respond. In the form, open **Settings → Responses** and turn off **Restrict to users in [your organisation]**.

## Connect it to the site

Set `shareFormUrl` in [`src/lib/site.ts`](../../src/lib/site.ts) to the public link and commit. The `/share` page then shows a "Write your experience" button in place of "Submissions open soon".

## Publishing a submission

Each response row maps onto a writeup file. Copy [`content/writeups/_template.md`](../../content/writeups/_template.md) to `content/writeups/<program>-<year>-<author>.md`, then fill it in:

| Form field                    | Writeup field                                   |
| ----------------------------- | ----------------------------------------------- |
| Program name                  | `program` (the program's file name, e.g. `m2l`) |
| Year you attended             | `cohort`                                        |
| Your name as it should appear | `author`                                        |
| What you were at the time     | `authorContext`                                 |
| A title for your writeup      | `title`                                         |
| Your writeup                  | the Markdown body                               |

Set `published` to the day you publish it. If the program isn't listed yet, add it to `content/programs/` first, using the website they gave. The email and permission fields stay in the sheet and are never published.
