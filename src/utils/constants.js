const INTERNAL_SERVER_ERROR_MESSAGE = "Oops, something went wrong!";

const UserRoles = {
  OWNER: "OWNER",
  MEMBER: "MEMBER",
};

const QuestionType = {
  TEXT: "text",
  STATEMENT: "statement",
  YES_NO: "yes_no",
  DATE: "date",
  NUMBER: "number",
  DROPDOWN: "dropdown",
  EMAIL: "email",
  MULTIPLE_CHOICE: "multiple_choice",
  WEBSITE: "website",
  LINEAR_SCALE: "linear_scale",
  RATING: "rating",
};

module.exports = {
  UserRoles,
  INTERNAL_SERVER_ERROR_MESSAGE,
  QuestionType,
};
