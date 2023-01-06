setupEmailTemplateForm = () => {
  PLACEHOLDERS_INSTRUCTIONS_PREFIX =
    "You may use *only* the following placeholder(s): ";
  NO_PLACEHOLDERS_MESSAGE = "N/A. Do not use any placeholders.";
  COURSE_PLACEHOLDER_MESSAGE = "$COURSE$ for the course name.";
  PLACEHOLDERS = {
    "Course Approved Email": {
      subject: COURSE_PLACEHOLDER_MESSAGE,
      body:
        COURSE_PLACEHOLDER_MESSAGE +
        " $CONTACT_INFO$ for the group's contact summary.",
    },
    "Course Denied Email": {
      subject: COURSE_PLACEHOLDER_MESSAGE,
      body: NO_PLACEHOLDERS_MESSAGE,
    },
    "First Login Welcome Email": {
      subject: NO_PLACEHOLDERS_MESSAGE,
      body: NO_PLACEHOLDERS_MESSAGE,
    },
    "New Group Welcome Email": {
      subject: COURSE_PLACEHOLDER_MESSAGE,
      body: COURSE_PLACEHOLDER_MESSAGE + " $RECIPIENT for the student's name.",
    },
    "New Student Welcome Email": {
      subject:
        COURSE_PLACEHOLDER_MESSAGE +
        " $JOINEE$ for the name of the student who's joining the group.",
      body:
        COURSE_PLACEHOLDER_MESSAGE +
        " $JOINEE$ for the name of the student who's joining the group.",
    },
    "Waiting Approval Email": {
      subject: COURSE_PLACEHOLDER_MESSAGE,
      body: NO_PLACEHOLDERS_MESSAGE,
    },
  };

  EMAIL_TYPE_SELECTOR = $("#email-type-selector");
  EMAIL_SUBJECT_INPUT = $("#email-subject-input");
  EMAIL_BODY_INPUT = $("#email-body-input");
  EMAIL_SUBJECT_HELP = $("#email-subject-help");
  EMAIL_BODY_HELP = $("#email-body-help");

  updateEmailTemplateForm = (data, newType) => {
    ({ body, subject } = data[newType]);
    EMAIL_SUBJECT_INPUT.val(subject);
    EMAIL_BODY_INPUT.val(body);
    EMAIL_SUBJECT_HELP.html(
      PLACEHOLDERS_INSTRUCTIONS_PREFIX + PLACEHOLDERS[newType].subject
    );
    EMAIL_BODY_HELP.html(
      PLACEHOLDERS_INSTRUCTIONS_PREFIX + PLACEHOLDERS[newType].body
    );
  };

  $.get("get_email_templates", (res) => {
    data = res.res;
    types = Object.keys(data);
    typeSelector = EMAIL_TYPE_SELECTOR;
    types.forEach((type) => {
      typeSelector.append(`<option value="${type}">${type}</option>`);
    });
    updateEmailTemplateForm(data, types[0]);
    $("#email-submit").prop("disabled", false);
  }).done((res) => {
    data = res.res;
    EMAIL_TYPE_SELECTOR.change(() => {
      newType = EMAIL_TYPE_SELECTOR.val();
      updateEmailTemplateForm(data, newType);
    });
  });
};

$(document).ready(() => {
  setupEmailTemplateForm();
});
