window.Home = {
  initialize(domEl) {
    ReactDOM.render(
      <HomeMain />,
      domEl
    );
  },

  initializeAutocompletion () {
    // Show dropdown.
    let locationInput = HomeSearchTool.instance.refs.locationInput;
    let autocomplete = new google.maps.places.Autocomplete(
      locationInput, {
        types: ['(cities)']
      }
    );

    autocomplete.addListener("place_changed", () => {
      let placeAddress = autocomplete.getPlace().formatted_address;
      HomeSearchTool.instance.setState({ location: placeAddress });
    });
  }
}
