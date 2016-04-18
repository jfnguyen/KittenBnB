let SearchStateStore = {
  UPDATE_SEARCH: 'UPDATE_SEARCH',
  storeInstance: null,

  updateSearch(props) {
    return {
      type: this.UPDATE_SEARCH,
      props: props
    }
  },

  searchStateReducer(state, action) {
    switch (action.type) {
    case this.UPDATE_SEARCH:
      return {
        ...state,
        ...action.props
      };
    default:
      return state;
    }
  },

  onChangeCallbacks(dispatch) {
    return {
      onValuesChange: (props) => {
        dispatch(this.updateSearch(props));
      },

      onBoolValueChange: (propName, event) => {
        dispatch(this.updateSearch({
          [propName]: event.target.value === "true"
        }));
      },

      onIntValueChange: (propName, event) => {
        dispatch(this.updateSearch({
          [propName]: parseInt(event.target.value)
        }));
      },

      onStringValueChange: (propName, event) => {
        dispatch(this.updateSearch({
          [propName]: event.target.value
        }));
      },
    };
  },

  initialize(initialSearchState) {
    this.storeInstance = Redux.createStore(
      this.searchStateReducer,
      initialSearchState
    );
  },
};

// Will carefully autobind methods here.
Object.keys(SearchStateStore).forEach(function (methodName) {
  var method = SearchStateStore[methodName];

  if (!(typeof method === "function")) {
    return;
  }

  SearchStateStore[methodName] = method.bind(SearchStateStore);
});
