import React from "react";
import { reduxForm, formValueSelector } from "redux-form";
import { connect } from "react-redux";

import { getLocale } from "../../localization";
import type { SelectOptionsT } from "../../api/types";
import type { DatasetIdT } from "../../api/types";

import {
  validateRequired,
  validateDateRange,
  validatePositive,
  validateConceptGroupFilled
} from "../validators";
import { collectAllFields } from "../helper";
import { selectReduxFormState } from "../stateSelectors";
import FormsHeader from "../FormsHeader";

import type {
  Form as FormType,
  FormField as FormFieldType
} from "../config-types";

import Field from "./Field";
import { StateT } from "app-types";

const DEFAULT_VALUE_BY_TYPE = {
  STRING: "",
  NUMBER: null,
  CHECKBOX: false,
  CONCEPT_LIST: [],
  RESULT_GROUP: null,
  MULTI_RESULT_GROUP: [],
  SELECT: null,
  TABS: null,
  DATASET_SELECT: null,
  MULTI_SELECT: null,
  DATE_RANGE: {
    min: null,
    max: null
  }
};

const DEFAULT_VALIDATION_BY_TYPE = {
  STRING: null,
  NUMBER: null,
  CHECKBOX: null,
  CONCEPT_LIST: null,
  RESULT_GROUP: null,
  MULTI_RESULT_GROUP: null,
  SELECT: null,
  TABS: null,
  DATASET_SELECT: null,
  MULTI_SELECT: null,
  DATE_RANGE: validateDateRange
};

function getPossibleValidations(fieldType: string) {
  const notEmptyValidation =
    fieldType === "CONCEPT_LIST"
      ? {
          NOT_EMPTY: validateConceptGroupFilled
        }
      : {
          NOT_EMPTY: validateRequired
        };

  return {
    ...notEmptyValidation,
    GREATER_THAN_ZERO: validatePositive
  };
}

function getInitialValue(field: FormFieldType) {
  // @ts-ignore
  return field.defaultValue || DEFAULT_VALUE_BY_TYPE[field.type];
}

function getErrorForField(field: FormFieldType, value: any) {
  const defaultValidation = DEFAULT_VALIDATION_BY_TYPE[field.type];

  let error = defaultValidation ? defaultValidation(value) : null;
  // @ts-ignore
  if (!!field.validations && field.validations.length > 0) {
    // @ts-ignore
    for (const validation of field.validations) {
      // @ts-ignore
      const validateFn = getPossibleValidations(field.type)[validation];

      if (validateFn) {
        // If not, someone must have configured an unsupported validation
        error = error || validateFn(value);
      }
    }
  }

  return error;
}

type ConfiguredFormPropsType = {
  config: FormType;
  selectedDatasetId: DatasetIdT;
};

type PropsType = {
  onSubmit: Function;
  getFieldValue: (fieldName: string) => any;
  availableDatasets: SelectOptionsT;
  selectedDatasetId: DatasetIdT;
};

// This is the generic form component that receives a form config
// and builds all fields from there.
//
// Note: The config contains the fields in a hierarchical structure,
//       because one of the fields is a "TAB", which contains subfields
//       depending on the tab, that is selected
//
// The form works with `redux-form``
const ConfiguredForm = ({ config, ...props }: ConfiguredFormPropsType) => {
  const Form = ({
    getFieldValue,
    availableDatasets,
    selectedDatasetId
  }: PropsType) => {
    const locale = getLocale();

    return (
      // @ts-ignore
      <form>
        <FormsHeader
          // @ts-ignore
          headline={config.headline[locale]}
        />
        {config.fields.map(field => (
          <Field
            key={field.name}
            formType={config.type}
            getFieldValue={getFieldValue}
            field={field}
            selectedDatasetId={selectedDatasetId}
            availableDatasets={availableDatasets}
            locale={locale}
          />
        ))}
      </form>
    );
  };

  const allFields = collectAllFields(config.fields);

  const fieldValueSelector = formValueSelector(
    config.type,
    // @ts-ignore
    selectReduxFormState
  );

  const ReduxFormConnectedForm = reduxForm({
    form: config.type,
    // @ts-ignore
    getFormState: selectReduxFormState,
    initialValues: allFields.reduce((allValues, field) => {
      // @ts-ignore
      allValues[field.name] = getInitialValue(field);

      return allValues;
    }, {}),
    destroyOnUnmount: false,
    validate: values =>
      Object.keys(values).reduce((errors, name) => {
        const field = allFields.find(field => field.name === name);

        // Note: For some reason, redux form understands, that:
        //       EVEN IF we add errors for ALL fields –
        //       including those fields that are not shown,
        //       because their tab is hidden – as long as those
        //       fields are not "rendered", the form seems to be valid
        //
        // => Otherwise, we'd have to check which tab is selected here,
        //    and which errors to add
        // @ts-ignore
        const error = getErrorForField(field, values[name]);

        if (error) {
          // @ts-ignore
          errors[name] = error;
        }

        return errors;
      }, {})
    // @ts-ignore
  })(Form);

  const mapStateToProps = (state: StateT) => ({
    getFieldValue: (field: string) => fieldValueSelector(state, field),
    availableDatasets: state.datasets.data.map(dataset => ({
      label: dataset.label,
      value: dataset.id
    }))
  });

  const ReduxConnectedForm = connect(mapStateToProps)(ReduxFormConnectedForm);

  // @ts-ignore
  return <ReduxConnectedForm {...props} />;
};

export default ConfiguredForm;
