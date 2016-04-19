let SearchStateStore = {
  REPLACE_LISTINGS: 'REPLACE_LISTINGS',
  UPDATE_SEARCH: 'UPDATE_SEARCH',
  storeInstance: null,

  fetchResults() {
    return (dispatch, getResults) => {
      let searchParams = getResults().params

      $.ajax({
        url: "/search.json",
        data: { search: searchParams },
      }).then((resultListings) => {
        dispatch(this.replaceListings(resultListings));
      });
    };
  },

  replaceListings(listings) {
    return {
      type: this.REPLACE_LISTINGS,
      listings
    };
  },

  updateSearch(props) {
    return {
      type: this.UPDATE_SEARCH,
      props
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
    switch (action.type) {
    case this.REPLACE_LISTINGS:
      console.log(action.listings)
      return {
        listings: action.listings
      };
    default:
      return results;
    }
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
      fetchResults: () => {
        // TODO: prolly should rename onChangeCallbacks...
        dispatch(this.fetchResults());
      },

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

  initialize(initialParams) {
    initialParams = {
      entireHome: false,
      privateRoom: false,
      sharedRoom: false,

      minPrice: 10,
      maxPrice: 999,

      geoBounds: null,
      geoCenter: null,

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
