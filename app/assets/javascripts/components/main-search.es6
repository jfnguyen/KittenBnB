class SearchTool extends React.Component {
  constructor(props) {
    super(props);

    // The singleton instance of SearchTool:
    SearchTool.instance = this;

    this.state = {
      dateRangeStart: "Check In",
      dateRangeEnd: "Check Out",
      location: "",
      numGuests: 1
    };

    // React doesn't autobind ES6 methods.
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
        dateRangeStart: date.format("MM/DD/YYYY")
      });
    });

    $dateRangeInput.on("didUpdateEnd", (e, date) => {
      this.setState({
        dateRangeEnd: date.format("MM/DD/YYYY")
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

    // Input exists only for datepicker to interact with.
    var dateRangeStartInput = (
      <div className="item" onClick={this.triggerClick}>
        <input name="search[dateRange]"
               ref="dateRange"
               type="text"
               style={{ width: "0px", paddingLeft: "0px" }} />
        <input name="search[dateRangeStart]"
               type="text"
               style={{ width: "0px", paddingLeft: "0px" }}
               value={this.state.dateRangeStart} readOnly />
        <span>{this.state.dateRangeStart}</span>
      </div>
    );

    var dateRangeEndInput = (
      <div className="item"
           key="dateRangeEndInput"
           onClick={this.triggerClick}>
        <input name="search[dateRangeEnd]"
               type="text"
               style={{ width: "0px", paddingLeft: "0px" }}
               value={this.state.dateRangeEnd} readOnly />
        {this.state.dateRangeEnd}
      </div>
    );

    var nums = [2, 3, 4, 5, 6]
    var numGuestsSelect = (
      <select name="search[numGuests]"
              className="last-item item"
              key="numGuestsSelect"
              onChange={(e) => this.setState({numGuests: e.target.value}) }
              value={this.state.numGuests}>
        <option value="1">1 Guest</option>
        { nums.map(i => <option key={i} value={i}>{i} Guests</option>) }
      </select>
    );

    var submitButton = (
      <button className="item" key="submitButton" onClick={this.submitForm}>
        Search
      </button>
    );

    var errorMessage = this.state.currentError == null ? null : (
        <div className="error-message">
          <span>{this.state.currentError}</span>
        </div>
    );

    return (
      <div>
        <form className="searchbar" action="/search" method="GET">
          <div className="first-item item">
            {locationInput}
          </div>{dateRangeStartInput}<div className="graphic-item item">
            →
          </div>{ [dateRangeEndInput, numGuestsSelect, submitButton] }

        </form>

        {errorMessage}
      </div>
    );
  }

  submitForm(e) {
    var error = this.validationErrors();
    if (error) {
      e.preventDefault();
      this.setState({ currentError: error });
    }
  }

  triggerClick() {
    $(this.refs.dateRange).trigger("click");
  }

  validationErrors() {
    if (this.state.location == "") {
      return "Destination location cannot be blank.";
    } else if (this.state.dateRangeStart == "Check In") {
      return "Check in date cannot be blank.";
    } else if (this.state.dateRangeEnd == "Check Out") {
      return "Check out date cannot be blank.";
    }

    var validDates = (moment(new Date(this.state.dateRangeStart)).isBefore(
      moment(new Date(this.state.dateRangeEnd))));
    if (!validDates) {
      return "Check out must occur after check-in.";
    }

    return null;
  }
}

function setupMainSearch(domEl) {
  ReactDOM.render(
    <SearchTool />,
    domEl
  );
}

function initMainSearchPlaces () {
  // Show dropdown.
  var locationInput = SearchTool.instance.refs.locationInput;
  var autocomplete = new google.maps.places.Autocomplete(
    locationInput, {
      types: ['(cities)']
    }
  );
  autocomplete.addListener("place_changed", function () {
    var placeAddress = autocomplete.getPlace().formatted_address;
    SearchTool.instance.setState({ location: placeAddress });
  });
}
