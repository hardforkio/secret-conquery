import { flatmap } from "../common/helpers/commonHelper";

import type { FormField as FormFieldType } from "./config-types";

export function collectAllFields(fields: FormFieldType[]): FormFieldType[] {
  //@ts-ignore
  return flatmap(fields, field => {
    if (field.type === "TABS") {
      return [field].concat(
        //@ts-ignore
        flatmap(field.tabs, tab => collectAllFields(tab.fields))
      );
    } else {
      return field;
    }
  });
}
