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

function initializeSearchStateStore(initialSearchState) {
  window.searchStateStore = Redux.createStore(
    searchStateReducer,
    initialSearchState
  );
}
