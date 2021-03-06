import React from "react";
import styled from "@emotion/styled";
import T from "i18n-react";

import { getConceptById } from "../concept-trees/globalTreeStoreHelper";
import { sortSelects } from "../model/select";

import InputMultiSelect from "../form-components/InputMultiSelect";
import InputCheckbox from "../form-components/InputCheckbox";

import type { PropsType } from "./QueryNodeEditor";

import ConceptEntry from "./ConceptEntry";
import ConceptDropzone from "./ConceptDropzone";
import ContentCell from "./ContentCell";

const Row = styled("div")`
  max-width: 300px;
  margin-bottom: 10px;
`;

const RowHeading = styled("h5")`
  margin: 0 0 10px 0;
  font-size: ${({ theme }) => theme.font.sm};
`;

const NodeDetailsView = (props: PropsType) => {
  const {
    node,
    onSelectSelects,
    isExcludeTimestampsPossible,
    onToggleTimestamps,
    onDropConcept,
    onRemoveConcept
  } = props;

  const rootConcept = !node.isPreviousQuery ? getConceptById(node.tree) : null;

  return (
    <ContentCell>
      {isExcludeTimestampsPossible && (
        <Row>
          <InputCheckbox
            label={T.translate("queryNodeEditor.excludeTimestamps")}
            input={{
              value: node.excludeTimestamps,
              onChange: () => onToggleTimestamps()
            }}
          />
        </Row>
      )}
      {
        // @ts-ignore
        node.selects && (
          <Row>
            <RowHeading>{T.translate("queryNodeEditor.selects")}</RowHeading>
            <InputMultiSelect
              input={{
                onChange: onSelectSelects,
                // @ts-ignore
                value: node.selects
                  // @ts-ignore
                  .filter(({ selected }) => !!selected)
                  // @ts-ignore
                  .map(({ id, label }) => ({ value: id, label: label }))
              }}
              // @ts-ignore
              options={sortSelects(node.selects).map(select => ({
                value: select.id,
                label: select.label
              }))}
            />
          </Row>
        )
      }
      {!node.isPreviousQuery && rootConcept && rootConcept.children && (
        <Row>
          <RowHeading>{rootConcept.label}</RowHeading>
          <div>
            <ConceptDropzone
              node={node}
              // @ts-ignore
              onDropConcept={onDropConcept}
            />
          </div>
          <div>
            {node.ids.map(conceptId => (
              <ConceptEntry
                key={conceptId}
                // @ts-ignore
                node={getConceptById(conceptId)}
                conceptId={conceptId}
                canRemoveConcepts={node.ids.length > 1}
                onRemoveConcept={onRemoveConcept}
              />
            ))}
          </div>
        </Row>
      )}
    </ContentCell>
  );
};

export default NodeDetailsView;
