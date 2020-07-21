import React from "react";
import { useSelector } from "react-redux";
import styled from "@emotion/styled";
import T from "i18n-react";

import Modal from "../../modal/Modal";
import BasicButton from "../../button/BasicButton";
import PrimaryButton from "../../button/PrimaryButton";
import {
  selectActiveFormValues,
  useVisibleConceptListFields
} from "../stateSelectors";

import InputSelect from "../../form-components/InputSelect";
import InputCheckbox from "../../form-components/InputCheckbox";
import { getLocale } from "../../localization";

const Buttons = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`;

const Options = styled("div")`
  padding: 8px 0 0 28px;
  overflow-y: auto;
  max-height: 345px;
`;

const SelectAllCheckbox = styled(InputCheckbox)`
  margin: 10px 0 0 8px;
`;

const SxInputCheckbox = styled(InputCheckbox)`
  margin: 5px 0;
`;

type PropsT = {
  targetFieldname: string;
  onAccept: (selectedNodes: Record<string, any>[]) => void;
  onClose: () => void;
};

const FormConceptCopyModal = ({
  targetFieldname,
  onAccept,
  onClose
}: PropsT) => {
  const locale = getLocale();
  //@ts-ignore
  const formValues = useSelector(state => selectActiveFormValues(state));
  const visibleConceptListFields = useVisibleConceptListFields();

  const conceptListFieldOptions = visibleConceptListFields
    //@ts-ignore
    .filter(field => field.name !== targetFieldname)
    //@ts-ignore
    .map(field => ({
      label: field.label[locale],
      value: field.name
    }));

  // Since the modal is only rendered when there exists more than one concept list field
  // we can assume that `conceptListFieldOptions` still has length >= 1
  const [selectedOption, setSelectedOption] = React.useState<string>(
    conceptListFieldOptions[0].value
  );

  const [valuesChecked, setValuesChecked] = React.useState<{
    [key: number]: boolean;
  }>({});

  React.useEffect(() => {
    const values = formValues[selectedOption];
    //@ts-ignore
    const initiallyChecked = values.reduce((checkedValues, value, i) => {
      checkedValues[i] = false;
      return checkedValues;
    }, {});

    setValuesChecked(initiallyChecked);
  }, [formValues, selectedOption]);

  const allConceptsSelected = Object.keys(valuesChecked).every(
    //@ts-ignore
    key => valuesChecked[key]
  );

  const isAcceptDisabled = Object.keys(valuesChecked).every(
    //@ts-ignore
    key => !valuesChecked[key]
  );

  function idxHasConcepts(idx: number) {
    const values = formValues[selectedOption];
    //@ts-ignore
    const concepts = values[idx].concepts.filter(cpt => !!cpt);

    return concepts.length > 0;
  }

  function getLabelFromIdx(idx: number) {
    const values = formValues[selectedOption];
    //@ts-ignore
    const concepts = values[idx].concepts.filter(cpt => !!cpt);

    if (concepts.length === 0) return "-";

    return (
      concepts[0].label +
      (concepts.length > 1 ? ` + ${concepts.length - 1}` : "")
    );
  }

  //@ts-ignore
  function onToggleAllConcepts(checked: boolean) {
    const allChecked = Object.keys(valuesChecked).reduce((all, key) => {
      //@ts-ignore
      all[key] = allConceptsSelected ? false : true;

      return all;
    }, {});

    setValuesChecked(allChecked);
  }

  function onToggleConcept(idx: number, checked: boolean) {
    const nextValues = {
      ...valuesChecked,
      [idx]: checked
    };

    setValuesChecked(nextValues);
  }

  function onSubmit() {
    const selectedValues = Object.keys(valuesChecked)
      //@ts-ignore
      .filter(key => valuesChecked[key])
      .map(key => formValues[selectedOption][key]);

    onAccept(selectedValues);
    onClose();
  }

  return (
    <Modal
      onClose={onClose}
      closeIcon
      headline={T.translate("externalForms.copyModal.headline")}
    >
      <InputSelect
        label={T.translate("externalForms.copyModal.selectLabel")}
        options={conceptListFieldOptions}
        input={{ onChange: setSelectedOption, value: selectedOption }}
      />
      <SelectAllCheckbox
        label={T.translate("externalForms.copyModal.selectAll")}
        input={{ value: allConceptsSelected, onChange: onToggleAllConcepts }}
      />
      <Options>
        {
          //@ts-ignore
          Object.keys(valuesChecked).map((idx, i) =>
            //@ts-ignore
            idxHasConcepts ? (
              <SxInputCheckbox
                key={idx}
                //@ts-ignore
                label={getLabelFromIdx(idx)}
                input={{
                  //@ts-ignore
                  value: valuesChecked[idx],
                  //@ts-ignore
                  onChange: (checked: boolean) => onToggleConcept(idx, checked)
                }}
              />
            ) : null
          )
        }
      </Options>
      <Buttons>
        <BasicButton onClick={onClose}>
          {T.translate("common.cancel")}
        </BasicButton>
        <PrimaryButton
          onClick={onSubmit} //@ts-ignore
          disabled={isAcceptDisabled}
        >
          {T.translate("externalForms.copyModal.accept")}
        </PrimaryButton>
      </Buttons>
    </Modal>
  );
};

export default FormConceptCopyModal;
