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
    let $target = $(event.target);
    console.log($target);

    // Remove listener.
    // TODO: will have to eventually restore it.
    google.maps.event.clearListeners(marker, 'click');

    // Open for styling!
    $target.addClass("open");
    // HACK to open wrapper.
    $target.parent().parent().addClass("open");

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
