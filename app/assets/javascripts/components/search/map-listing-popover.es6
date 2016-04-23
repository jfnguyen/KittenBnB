class SearchMapListingPopover extends React.Component {
  render() {
    return <p>Hello there!</p>
  }
}

Object.assign(SearchMapListingPopover, {
  attachToMarker(marker, listing) {
    marker.addListener("click", this.showPopover.bind(this, marker, listing));
  },

  showPopover(marker, listing, event) {
    // Sometimes event.target isn't set to the content div...
    let $target = $(marker.markerContent_).find(".map-marker");

    // Remove listener.
    // TODO: will have to eventually restore it.
    google.maps.event.clearListeners(marker, 'click');

    // Open for styling!
    $target.addClass("open");
    // HACK to open wrapper.
    let markerWrapper = $target.parent().parent();
    markerWrapper.addClass("open");
    // HACK to stop doubleclicks from zooming the map.
    markerWrapper.on("dblclick", (e) => e.stopPropagation());
    // HACK to make sure popover appears above other price markers.
    markerWrapper.parent().append(markerWrapper);

    // Debugging for now.
    console.log(markerWrapper[0])

    let listingElement = React.createElement(
      SearchListing.WrappedComponent, {
        listing: listing,
        focusListing: () => {} // Hack to prevent focusing
      }
    );

    ReactDOM.render(
      listingElement,
      event.target
    );
  }
});
