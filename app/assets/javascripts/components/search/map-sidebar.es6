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

      let map = new google.maps.Map(this.refs.map, {
        center: center,
        disableDefaultUI: true,
        zoomControl: true,
        zoom: 12,
      });
    });
  }

  render() {
    return (
      <div className="map-sidebar">
        <div ref="map" className="map"></div>
      </div>
    );
  }
}

SearchMapSidebar = ReactRedux.connect(
  (searchState) => ({
    location: searchState.location
  })
)(SearchMapSidebar);
