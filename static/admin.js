EMAIL_TYPE_SELECTOR = $("#email-type-selector");
EMAIL_SUBJECT_INPUT = $("#email-subject-input");
EMAIL_BODY_INPUT = $("#email-body-input");

updateEmailTemplateForm = (data, newType) => {
  ({ body, subject } = data[newType]);
  EMAIL_SUBJECT_INPUT.val(subject);
  EMAIL_BODY_INPUT.val(body);
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
