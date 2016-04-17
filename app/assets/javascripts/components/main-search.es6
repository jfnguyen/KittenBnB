class SearchTool extends React.Component {
  constructor(props) {
    // React doesn't autobind ES6 methods.
    super(props);

    // The singleton instance of SearchTool:
    SearchTool.instance = this;

    this.state = {
      dateRangeStartInput: "Check In",
      dateRangeEndInput: "Check Out",
      numGuests: 1
    };
    this.submitForm = this.submitForm.bind(this);
    this.triggerClick = this.triggerClick.bind(this);
  }

  componentDidMount() {
    var $dateRangeInput = $(this.refs.dateRange);

    $dateRangeInput.daterangepicker({
      autoApply: true,
      drops: "down"
    });

    $dateRangeInput.on("didUpdateStart", (e, date) => {
      this.setState({
        dateRangeStartInput: date.format("MM/DD/YYYY")
      });
    });

    $dateRangeInput.on("didUpdateEnd", (e, date) => {
      this.setState({
        dateRangeEndInput: date.format("MM/DD/YYYY")
      });
    });
  }

  render() {
    var locationInput = (
      <input type="text"
             name="search[location]"
             ref="locationInput"
             placeholder="Where do you want to go?"
             onChange={(e) => this.setState({location: e.target.value})}
             value={this.state.location} />
    );

    var hiddenLatLngInput = (
      <input type="hidden"
             name="search[locationLatLng]"
             id="location-lat-lng" />
    );

    // Input exists only for datepicker to interact with.
    var dateRangeStartInput = (
      <div className="item" onClick={this.triggerClick}>
        <input name="search[dateRange]"
               ref="dateRange"
               type="text"
               style={{ width: "0px", paddingLeft: "0px" }} />
        <span>{this.state.dateRangeStartInput}</span>
      </div>
    );

    var dateRangeEndInput = (
        <div className="item"
             key="dateRangeEndInput"
             onClick={this.triggerClick}>
        {this.state.dateRangeEndInput}
      </div>
    );

    var nums = [2, 3, 4, 5, 6]
    var numGuestsSelect = (
      <select name="search[numGuests]"
              className="last-item item"
              key="numGuestsSelect"
              onChange={(e) => this.setState({numGuests: e.target.value}) }
              value={this.state.numGuests}>
        <option>1 Guest</option>
        { nums.map(i => <option key={i} value={i}>{i} Guests</option>) }
      </select>
    );

    var submitButton = (
      <button className="item" key="submitButton" onClick={this.submitForm}>
        Search
      </button>
    );

    return (
      <form className="searchbar" action="/search" method="GET">
        <div className="first-item item">
          {locationInput}
          {hiddenLatLngInput}
        </div>{dateRangeStartInput}<div className="graphic-item item">
          →
        </div>{ [dateRangeEndInput, numGuestsSelect, submitButton] }
      </form>
    );
  }

  submitForm(e) {
    e.preventDefault();
    console.log(this.state);
  }

  triggerClick() {
    $(this.refs.dateRange).trigger("click");
  }
}

function setupMainSearch(domEl) {
  ReactDOM.render(
    <SearchTool />,
    domEl
  );
}

function initMainSearchPlaces () {
  var options = {
    types: ['(cities)'],
  };

  var locationInput = SearchTool.instance.refs.locationInput;
  var autocomplete = new google.maps.places.Autocomplete(
    locationInput, options
  );

  autocomplete.addListener("place_changed", function () {
    var placeAddress = autocomplete.getPlace().formatted_address;
    SearchTool.instance.setState({location: placeAddress});

    /*
    var location = autocomplete.getPlace().geometry.location;
    var latLng = [location.lat(), location.lng()];
    $("#location-lat-lng").val("[" + latLng.toString() + "]")
    */
  });
}
