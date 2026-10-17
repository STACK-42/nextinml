/**
 * Creates the NextInML "Share your experience" Google Form and a Google
 * Sheet that collects its responses.
 *
 * Run once from script.google.com (see README.md in this folder). Running it
 * again creates a second, separate form. The URLs are printed to the
 * execution log; the public one goes into src/lib/site.ts as shareFormUrl.
 *
 * The questions mirror content/writeups/_template.md and the /share page, so
 * a response maps directly onto a writeup's frontmatter and body.
 */

const FORM_TITLE = "NextInML · Share your experience";

const WRITEUP_QUESTIONS = [
  "What did your application include, and how long did it take?",
  "What background did you have going in, and was it enough?",
  "What did a typical day look like?",
  "What did it cost you, including travel and visas, and what was covered?",
  "What did you get out of it a few months later?",
  "Who should apply, and who should skip it?",
];

function createShareForm() {
  const form = FormApp.create(FORM_TITLE);

  form
    .setDescription(
      "NextInML lists ML summer schools, fellowships, and internships for early-stage " +
        "students. If you attended one, an honest account of what it was like helps the " +
        "next student decide whether to apply.\n\n" +
        "Every submission is read before it is published. We may edit for length and " +
        "clarity, and we will check anything unclear with you first.",
    )
    .setConfirmationMessage(
      "Thank you. Your writeup will be read before it goes up, and if you left an email " +
        "we will contact you with any questions.",
    )
    .setCollectEmail(false)
    .setAllowResponseEdits(false)
    .setShowLinkToRespondAgain(true)
    .setProgressBar(false);

  // 1. Which program
  form
    .addTextItem()
    .setTitle("Program name")
    .setHelpText("For example: Mediterranean Machine Learning Summer School (M2L).")
    .setRequired(true);

  form
    .addTextItem()
    .setTitle("Program website")
    .setHelpText("Only needed if the program isn't listed on NextInML yet.")
    .setValidation(
      FormApp.createTextValidation()
        .requireTextIsUrl()
        .setHelpText("Enter a full link, starting with https://")
        .build(),
    );

  form
    .addTextItem()
    .setTitle("Year you attended")
    .setHelpText("The edition you went to, for example 2025.")
    .setRequired(true)
    .setValidation(
      FormApp.createTextValidation()
        .requireNumberBetween(2000, 2100)
        .setHelpText("Enter a year, for example 2025.")
        .build(),
    );

  // 2. About the author
  form
    .addTextItem()
    .setTitle("Your name as it should appear")
    .setHelpText("Your name, or your initials if you prefer.")
    .setRequired(true);

  form
    .addTextItem()
    .setTitle("What you were at the time")
    .setHelpText('For example: "3rd-year CS undergrad, Khartoum".');

  // 3. The writeup
  form
    .addTextItem()
    .setTitle("A title for your writeup")
    .setHelpText('For example: "What five days at M2L were actually like".');

  form
    .addParagraphTextItem()
    .setTitle("Your writeup")
    .setHelpText(
      "Write in the first person, about your own time there. These questions tend to help:\n\n" +
        WRITEUP_QUESTIONS.map((q, i) => i + 1 + ". " + q).join("\n"),
    )
    .setRequired(true);

  // 4. Contact and consent
  form
    .addTextItem()
    .setTitle("Email")
    .setHelpText("Optional. Only used to ask you about your writeup. Never published.")
    .setValidation(
      FormApp.createTextValidation()
        .requireTextIsEmail()
        .setHelpText("Enter a valid email address.")
        .build(),
    );

  form
    .addCheckboxItem()
    .setTitle("Permission to publish")
    .setChoiceValues([
      "I agree that NextInML may publish this writeup with my name or initials, edited for length and clarity.",
    ])
    .setRequired(true);

  // Responses also land in a spreadsheet, which is easier to review.
  const sheet = SpreadsheetApp.create(FORM_TITLE + " (responses)");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  // Newer Forms have an explicit publish step. Publish if this account supports it;
  // otherwise publish from the form editor (see README.md).
  if (typeof form.setPublished === "function") {
    form.setPublished(true);
  }

  Logger.log("Public link (put this in src/lib/site.ts): " + form.getPublishedUrl());
  Logger.log("Edit the form: " + form.getEditUrl());
  Logger.log("Responses sheet: " + sheet.getUrl());
}
