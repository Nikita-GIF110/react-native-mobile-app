import type { UserReportFormFields } from "@/src/shared/api/user";

export const BLOCKED_USER_FORM_FIELDS = [
  {
    value: "report",
    label: "Report user",
  },
  {
    value: "unblock",
    label: "Unblock a user",
  },
];
export const UNBLOCKED_USER_FORM_FIELDS = [
  {
    value: "report",
    label: "Report user",
  },
  {
    value: "block",
    label: "Block a user",
  },
];
export const REPORT_USER_FORM_FIELDS = [
  {
    value: "report",
    label: "Report user",
  },
  {
    value: "block",
    label: "Block a user",
  },
];

export const FORM_ACTIONS_USER_REPORT_ACTIONS_BYSTATUS: Record<
  UserReportFormFields["type"],
  { value: string; label: string }[]
> = {
  block: BLOCKED_USER_FORM_FIELDS,
  unblock: UNBLOCKED_USER_FORM_FIELDS,
  report: REPORT_USER_FORM_FIELDS,
};
