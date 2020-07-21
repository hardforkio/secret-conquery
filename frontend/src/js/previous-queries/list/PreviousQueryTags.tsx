import { connect } from "react-redux";

import Tags from "../../tags/Tags";

import { addTagToPreviousQueriesSearch } from "../search/actions";

//@ts-ignore
const tagContainsAnySearch = (tag, searches) => {
  return searches.some(
    //@ts-ignore
    search => tag.toLowerCase().indexOf(search.toLowerCase()) !== -1
  );
};

type PropsType = {
  tags?: string[];
};

//@ts-ignore
const mapStateToProps = (state, ownProps: PropsType) => ({
  tags: (ownProps.tags || []).map(tag => ({
    label: tag,
    isSelected: tagContainsAnySearch(tag, state.previousQueriesSearch)
  }))
});

const mapDispatchToProps = (dispatch: any) => ({
  //@ts-ignore
  onClickTag: tag => dispatch(addTagToPreviousQueriesSearch(tag))
});

export default connect(mapStateToProps, mapDispatchToProps)(Tags);
