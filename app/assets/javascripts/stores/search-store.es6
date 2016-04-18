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

let SearchStateOnChangeCallbacks = (dispatch) => ({
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

let searchStateStore = null;
function initializeSearchStateStore(initialSearchState) {
  searchStateStore = Redux.createStore(
    searchStateReducer,
    initialSearchState
  );
}
