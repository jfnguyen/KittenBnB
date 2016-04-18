const UPDATE_SEARCH = 'UPDATE_SEARCH';

function updateSearch(props) {
  return {
    type: UPDATE_SEARCH,
    props: props
  }
}

function searchStateReducer(state, action) {
  switch (action.type) {
  case UPDATE_SEARCH:
    return {
      ...state,
      ...action.props
    };
  default:
    return state;
  }
}

var SearchStateOnChangeCallbacks = (dispatch) => ({
  onValuesChange(props) {
    dispatch(updateSearch(props));
  },

  onBoolValueChange(propName, event) {
    dispatch(updateSearch({
      [propName]: event.target.value === "true"
    }));
  },

  onIntValueChange(propName, event) {
    dispatch(updateSearch({
      [propName]: parseInt(event.target.value)
    }));
  },

  onStringValueChange(propName, event) {
    dispatch(updateSearch({
      [propName]: event.target.value
    }));
  },
});

function initializeSearchStateStore(initialSearchState) {
  window.searchStateStore = Redux.createStore(
    searchStateReducer,
    initialSearchState
  );
}
