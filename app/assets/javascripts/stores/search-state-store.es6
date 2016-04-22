let SearchStateStore = {
  BEGIN_FETCH: 'BEGIN_FETCH',
  FOCUS_LISTING: 'FOCUS_LISTING',
  REPLACE_LISTINGS: 'REPLACE_LISTINGS',
  UPDATE_SEARCH: 'UPDATE_SEARCH',
  storeInstance: null,

  beginFetch() {
    return {
      type: this.BEGIN_FETCH
    };
  },

  fetchResults() {
    return (dispatch, getResults) => {
      let searchParams = getResults().params

      dispatch(this.beginFetch());

      return StaticMap.sampleRandomPoints()
        .then((candidateLocations) => {
          return $.ajax({
            method: "POST",
            url: "/search.json",
            data: {
              search: {
                  ...searchParams,
                candidateLocations
              }
            }
          });
        }).then((resultListings) => {
          dispatch(this.replaceListings(resultListings));
        });
    };
  },

  focusListing(listing) {
    return {
      type: this.FOCUS_LISTING,
      listing: listing
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

  resultsReducer(results, action, searchState) {
    switch (action.type) {
    case this.BEGIN_FETCH:
      // TODO: Not pure. But React Router is overkill for this.
      history.replaceState(null, null, this.queryUrl(searchState.params));

      return {
        ...results,
        isLoading: true
      };
    case this.FOCUS_LISTING:
      return {
        ...results,
        focusedListing: action.listing
      };
    case this.REPLACE_LISTINGS:
      return {
        listings: action.listings,
        isLoading: false
      };
    default:
      return results;
    }
  },

  rootReducer(searchState, action) {
    var newSearchState = {
      params: this.paramsReducer(
        searchState.params, action, searchState
      ),
      results: this.resultsReducer(
        searchState.results, action, searchState
      ),
    }

    return newSearchState;
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

      onBoolValueChange: (propName, value) => {
        dispatch(this.updateSearch({
          [propName]: value
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
      listings: [],
      isLoading: false,
      focusedListing: null
    };

    this.storeInstance = Redux.createStore(
      this.rootReducer, {
        params: initialParams,
        results: initialResults
      },
      Redux.applyMiddleware(ReduxThunk.default)
    );
  },

  queryUrl(searchParams) {
    return "/search?" + $.param({ search: searchParams });
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
