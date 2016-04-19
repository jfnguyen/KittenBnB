class SearchMapSidebar extends React.Component {
  constructor(props) {
    super(props)

    this.mapInstance = null;
    this.markers = null;
  }

  recenterMap() {
    // There may not be a map instance on the initial centering.
    if (this.mapInstance) {
      this.mapInstance.setCenter(this.props.geoCenter);
    }
  }

  componentDidMount() {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.props.location }, (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK) {
        alert('Geocode was not successful for the following reason: ' + status);
        return;
      }

      let location = results[0].geometry.location;
      this.props.onValuesChange({
        geoCenter: {
          lat: location.lat(),
          lng: location.lng()
        }
      });

      this.mapInstance = new google.maps.Map(this.refs.map, {
        center: this.props.geoCenter,
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

  componentDidUpdate(prevProps) {
    if (!_(prevProps.geoCenter).isEqual(this.props.geoCenter)) {
      this.recenterMap();
    }

    this.resetMarkers();
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

    let geoCenter = {
      lat: this.mapInstance.getCenter().lat(),
      lng: this.mapInstance.getCenter().lng(),
    };

    this.props.onValuesChange({
      geoBounds: geoBounds,
      geoCenter: geoCenter
    });

    this.props.fetchResults();
  }

  render() {
    return (
      <div className="map-sidebar">
        <div ref="map" className="map"></div>
      </div>
    );
  }

  resetMarkers() {
    if (this.markers !== null) {
      this.markers.forEach((marker) => {
        marker.setMap(null);
      });
    }

    this.markers = this.props.listings.map((listing) => {
      return new google.maps.Marker({
        position: new google.maps.LatLng(listing.latitude, listing.longitude),
        map: this.mapInstance,
      });
    });
  }
}

SearchMapSidebar.propTypes = {
  location: React.PropTypes.string.isRequired
};

SearchMapSidebar = ReactRedux.connect(
  (searchState) => ({
    geoBounds: searchState.params.geoBounds,
    geoCenter: searchState.params.geoCenter,
    listings: searchState.results.listings,
    location: searchState.params.location
  }),
  SearchStateStore.onChangeCallbacks
)(SearchMapSidebar);
