emailTemplateFormHelpers = {
  getPlaceholderMessage: (type) => {
    NO_PLACEHOLDERS_MESSAGE = "N/A. Do not use any placeholders.";
    COURSE_PLACEHOLDER_MESSAGE = "$COURSE$ for the course name.";
    CONTACT_INFO_PLACEHOLDER_MESSAGE =
      "$CONTACT_INFO$ for the study group's names and emails.";
    RECIPIENT_PLACEHOLDER_MESSAGE = "$RECIPIENT for the student's name.";
    JOINEE_PLACEHOLDER_MESSAGE =
      "$JOINEE$ for the name of the student who's joining the group.";

    PLACEHOLDERS = {
      "Course Approved Email": {
        subject: COURSE_PLACEHOLDER_MESSAGE,
        body:
          COURSE_PLACEHOLDER_MESSAGE + " " + CONTACT_INFO_PLACEHOLDER_MESSAGE,
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
        body: COURSE_PLACEHOLDER_MESSAGE + " " + RECIPIENT_PLACEHOLDER_MESSAGE,
      },
      "New Student Welcome Email": {
        subject: COURSE_PLACEHOLDER_MESSAGE + " " + JOINEE_PLACEHOLDER_MESSAGE,
        body: COURSE_PLACEHOLDER_MESSAGE + " " + JOINEE_PLACEHOLDER_MESSAGE,
      },
      "Waiting Approval Email": {
        subject: COURSE_PLACEHOLDER_MESSAGE,
        body: NO_PLACEHOLDERS_MESSAGE,
      },
    };

    return PLACEHOLDERS[type];
  },
  updateEmailTemplateForm: (data, newType) => {
    PLACEHOLDERS_INSTRUCTIONS_PREFIX =
      "<b>You may <i>only</i> use the following placeholder(s): </b>";

    EMAIL_SUBJECT_INPUT = $("#email-subject-input");
    EMAIL_BODY_INPUT = $("#email-body-input");
    EMAIL_SUBJECT_HELP = $("#email-subject-help");
    EMAIL_BODY_HELP = $("#email-body-help");

    ({ body, subject } = data[newType]);
    EMAIL_SUBJECT_INPUT.val(subject);
    EMAIL_BODY_INPUT.val(body);
    EMAIL_SUBJECT_HELP.html(
      PLACEHOLDERS_INSTRUCTIONS_PREFIX +
        emailTemplateFormHelpers.getPlaceholderMessage(newType).subject
    );
    EMAIL_BODY_HELP.html(
      PLACEHOLDERS_INSTRUCTIONS_PREFIX +
        emailTemplateFormHelpers.getPlaceholderMessage(newType).body
    );
  },
};

setupEmailTemplateForm = () => {
  EMAIL_TYPE_SELECTOR = $("#email-type-selector");
  $.get("get_email_templates", (res) => {
    data = res.res;
    types = Object.keys(data);
    typeSelector = EMAIL_TYPE_SELECTOR;
    types.forEach((type) => {
      typeSelector.append(`<option value="${type}">${type}</option>`);
    });
    emailTemplateFormHelpers.updateEmailTemplateForm(data, types[0]);
    $("#email-submit").prop("disabled", false);
  }).done((res) => {
    data = res.res;
    EMAIL_TYPE_SELECTOR.change(() => {
      newType = EMAIL_TYPE_SELECTOR.val();
      emailTemplateFormHelpers.updateEmailTemplateForm(data, newType);
    });
  });
};

setupApproveAllDeptGroupsBtns = (dept) => {
  $.post("/approve_all_dept_groups", { dept })
    .then((res) => {
      if (!res.success) {
        alert(
          `Failed to approve all courses in department ${dept} with error: "${res.error}".`
        );
        return;
      }

      alert(
        `Successfully approved all ${res.num_courses} courses in department ${dept}. All students in ${res.num_groups} pending study groups for these courses were notified via email.`
      );
    })
    .catch(() => {
      alert(
        `Failed to approve all courses in department ${dept}. Students in study groups were not notified.`
      );
    });
};

$(document).ready(() => {
  setupEmailTemplateForm();
});
