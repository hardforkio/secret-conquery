import React from "react";
import styled from "@emotion/styled";
import T from "i18n-react";
import clickOutside from "react-onclickoutside";

import PrimaryButton from "../button/PrimaryButton";
import ReactSelect from "./ReactSelect";

type PropsType = {
  className?: string;
  tags?: string[];
  loading: boolean;
  onSubmit: (tags: string[]) => void;
  onCancel: () => void;
  availableTags?: string[];
};

const StyledPrimaryButton = styled(PrimaryButton)`
  margin-top: 5px;
`;

class EditableTagsForm extends React.Component<PropsType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      values:
        (props.tags && props.tags.map(t => ({ label: t, value: t }))) || []
    };
  }

  handleClickOutside() {
    this.props.onCancel();
  }

  //@ts-ignore
  handleChange = (values: any, actionMeta: any) => {
    this.setState({ values });
  };

  //@ts-ignore
  _onSubmit(e) {
    e.preventDefault();

    //@ts-ignore
    const values = this.state.values
      ? //@ts-ignore
        this.state.values.map(v => v.value)
      : [];

    this.props.onSubmit(values);
  }

  render() {
    return (
      <form
        className={this.props.className}
        onSubmit={this._onSubmit.bind(this)}
      >
        <ReactSelect
          creatable
          name="input"
          //@ts-ignore
          value={this.state.values}
          //@ts-ignore
          options={this.props.availableTags.map(t => ({
            label: t,
            value: t
          }))}
          onChange={this.handleChange}
          isMulti
          isClearable
          autoFocus={true}
          placeholder={T.translate("reactSelect.tagPlaceholder")}
          noOptionsMessage={() => T.translate("reactSelect.noResults")}
          //@ts-ignore
          formatCreateLabel={inputValue =>
            T.translate("common.create") + `: "${inputValue}"`
          }
        />
        <StyledPrimaryButton
          //@ts-ignore
          type="submit"
          small
          disabled={this.props.loading}
        >
          {T.translate("common.save")}
        </StyledPrimaryButton>
      </form>
    );
  }
}

export default clickOutside(EditableTagsForm);
