import { transformElementsToApi } from "../api/apiHelper";

import type { Form as FormType } from "./config-types";

//@ts-ignore
function transformElementGroupsToApi(elementGroups) {
  //@ts-ignore
  return elementGroups.map(({ concepts, ...rest }) => ({
    type: "OR",
    children: transformElementsToApi(concepts),
    ...rest
  }));
}

//@ts-ignore
function transformFieldToApi(fieldConfig, form) {
  const formValue = form[fieldConfig.name];

  switch (fieldConfig.type) {
    case "RESULT_GROUP":
      return formValue.id;
    case "MULTI_RESULT_GROUP":
      //@ts-ignore
      return formValue.map(group => group.id);
    case "DATE_RANGE":
      return {
        min: formValue.min,
        max: formValue.max
      };
    case "CONCEPT_LIST":
      return transformElementGroupsToApi(formValue);
    case "TABS":
      //@ts-ignore
      const selectedTab = fieldConfig.tabs.find(tab => tab.name === formValue);

      return {
        value: formValue,
        // Only include field values from the selected tab
        ...transformFieldsToApi(selectedTab.fields, form)
      };
    default:
      return formValue;
  }
}

//@ts-ignore
function transformFieldsToApi(fields, form) {
  //@ts-ignore
  return fields.reduce((all, fieldConfig) => {
    all[fieldConfig.name] = transformFieldToApi(fieldConfig, form);

    return all;
  }, {});
}

const transformQueryToApi = (formConfig: FormType) => (
  form: Record<string, any>
) => {
  return {
    type: formConfig.type,
    ...transformFieldsToApi(formConfig.fields, form)
  };
};

export default transformQueryToApi;
