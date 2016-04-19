let SearchStateStore = {
  UPDATE_SEARCH: 'UPDATE_SEARCH',
  storeInstance: null,

  fetchResults() {
    return (dispatch, getResults) => {
      let searchParams = getResults().params

      $.ajax({
        url: "/search.json",
        data: searchParams,
      }).then(function (results) {
        // TODO: Do nothing for now!
        console.log(results);
      });
    };
  },

  updateSearch(props) {
    return {
      type: this.UPDATE_SEARCH,
      props: props
    }
  },

  paramsReducer(params, action) {
    switch (action.type) {
    case this.UPDATE_SEARCH:
      return {
        ...params,
        ...action.props
      };
    default:
      return params;
    }
  },

  resultsReducer(results, action) {
    return results;
  },

  rootReducer(state, action) {
    var newState = {
      params: this.paramsReducer(state.params, action),
      results: this.resultsReducer(state.results, action)
    }

    return newState;
  },

  onChangeCallbacks(dispatch) {
    return {
      onValuesChange: (props) => {
        dispatch(this.updateSearch(props));
        dispatch(this.fetchResults());
      },

      onBoolValueChange: (propName, event) => {
        dispatch(this.updateSearch({
          [propName]: event.target.value === "true"
        }));

        dispatch(this.fetchResults());
      },

      onIntValueChange: (propName, event) => {
        dispatch(this.updateSearch({
          [propName]: parseInt(event.target.value)
        }));

        dispatch(this.fetchResults());
      },

      onStringValueChange: (propName, event) => {
        dispatch(this.updateSearch({
          [propName]: event.target.value
        }));

        dispatch(this.fetchResults());
      },
    };
  },

  initialize(initialParams) {
    initialParams = {
      entireHome: false,
      privateRoom: false,
      sharedRoom: false,

      minPrice: 10,
      maxPrice: 999,

      geoBounds: null,

      ...initialParams
    };

    let initialResults = {
      isFetching: false,
      listings: []
    };

    this.storeInstance = Redux.createStore(
      this.rootReducer, {
        params: initialParams,
        results: initialResults
      },
      Redux.applyMiddleware(ReduxThunk.default)
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
