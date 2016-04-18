class SearchMapSidebar extends React.Component {
  componentDidMount() {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.props.location }, (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK) {
        alert('Geocode was not successful for the following reason: ' + status);
        return;
      }

      let center = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      }

      this.mapInstance = new google.maps.Map(this.refs.map, {
        center: center,
        disableDefaultUI: true,
        zoomControl: true,
        zoom: 12,
      });

      // Reduce speed of bounds changed reports.
      this.mapInstance.addListener("bounds_changed", _.debounce(
        this.onBoundsChanged.bind(this),
        250
      ));
    });
  }

  onBoundsChanged() {
    let northEast = this.mapInstance.getBounds().getNorthEast();
    let southWest = this.mapInstance.getBounds().getSouthWest();

    let geoBounds = {
      northEast: {
        lat: northEast.lat(),
        lng: northEast.lng()
      },

      southWest: {
        lat: southWest.lat(),
        lng: southWest.lng()
      }
    };

    console.log(geoBounds);
    this.props.onValuesChange("geoBounds", geoBounds);
  }

  render() {
    return (
      <div className="map-sidebar">
        <div ref="map" className="map"></div>
      </div>
    );
  }
}

SearchMapSidebar.propTypes = {
  location: React.PropTypes.string.isRequired
};

SearchMapSidebar = ReactRedux.connect(
  (searchState) => ({
    location: searchState.location
  }),
  SearchStateStore.onChangeCallbacks
)(SearchMapSidebar);
