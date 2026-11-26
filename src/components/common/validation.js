// Returns an i18n key for the first email problem, or "" when the email is acceptable.
// Same rules as the legacy forms.
export function emailErrorKey(email = "") {
  if (email.length < 5) return "EmailValid";
  if (email.split("").filter((x) => x === "@").length !== 1) return "EmailValid1";
  if (email.indexOf(".") === -1) return "EmailValid3";
  return "";
}
