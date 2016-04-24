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
        clickableIcons: false, // don't let user click "points of interest"
        disableDefaultUI: true,
        zoomControl: true,
        zoom: 12,
        maxZoom: 15,
        minZoom: 10
      });

      StaticMap.setMap(this.mapInstance);

      // Reduce speed of bounds changed reports.
      this.mapInstance.addListener("bounds_changed", _.debounce(
        this.onBoundsChanged.bind(this),
        750
      ));
    });
  }

  componentDidUpdate(prevProps) {
    if (!_(prevProps.geoCenter).isEqual(this.props.geoCenter)) {
      this.recenterMap();
    }

    if (prevProps.focusedListing !== this.props.focusedListing) {
      this.updateFocusedMarker();
    }

    this.refreshMarkers()
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

  installNewMarker(listing) {
    let marker = new rich.RichMarker({
      position: new google.maps.LatLng(listing.latitude, listing.longitude),
      map: this.mapInstance,
      draggable: false,
      flat: true,
      anchor: rich.RichMarkerPosition.MIDDLE,
    });

    // So that we can know which ones to add/remove later.
    marker.listingId = listing.id;

    let oldOnAdd = marker.onAdd;
    marker.onAdd = () => {
      oldOnAdd.apply(marker, arguments)

      // I need to style the outer div.
      $(marker.markerWrapper_).addClass("map-marker-wrapper");
      $(marker.markerWrapper_).children(":first").addClass("map-marker-wrapper-inner");
    };

    // This function is added so that others may easily restore the
    // original appearance of the marker.
    marker.restore = function () {
      // Return to old class style.
      marker.isOpen = false;
      marker.setZIndex(0);

      this.set("content", `
        <div class="map-marker" data-listing-id=${listing.id}>
          <sup>$</sup>${listing.pricePerNight}
        </div>
      `);

      // Install callback to show popover when clicked.
      SearchMapListingPopover.attachToMarker(marker, listing);
    };

    marker.restore();

    return marker;
  }

  refreshMarkers() {
    if (this.markers === null) {
      this.markers = [];
    }

    let newMarkers = [];
    this.markers.forEach(marker => {
      if (_(this.props.listings).some(l => l.id == marker.listingId)) {
        newMarkers.push(marker);
      } else {
        marker.setMap(null);
      }
    });

    this.props.listings.forEach(listing => {
      if (_(newMarkers).some(m => m.listingId == listing.id)) {
        return;
      }

      let marker = this.installNewMarker(listing)
      newMarkers.push(marker);
    });

    this.markers = newMarkers;
  }

  updateFocusedMarker() {
    let focusedListingId = this.props.focusedListing && this.props.focusedListing.id;

    this.markers.forEach(marker => {
      // Cheat and access the DOM node for the marker via private API.
      let markerNode = $(marker.markerContent_).children(":first");

      if (marker.listingId === focusedListingId) {
        if (marker.getZIndex() !== 0) {
          // Hack to avoid messing with zindex of popover.
          return;
        }

        $(markerNode).addClass("focused");
        marker.setZIndex(99);
        marker.isFocused = true;
      } else if (marker.isFocused) {
        if (marker.getZIndex() !== 99) {
          // Hack to avoid messing with zindex of popover.
          return;
        }

        $(markerNode).removeClass("focused");
        marker.setZIndex(0);
        marker.isFocused = false;
      }
    });
  }
}

SearchMapSidebar.propTypes = {
  location: React.PropTypes.string.isRequired
};

SearchMapSidebar = ReactRedux.connect(
  (searchState) => ({
    focusedListing: searchState.results.focusedListing,
    geoBounds: searchState.params.geoBounds,
    geoCenter: searchState.params.geoCenter,
    listings: searchState.results.listings,
    location: searchState.params.location
  }),
  SearchStateStore.onChangeCallbacks
)(SearchMapSidebar);
