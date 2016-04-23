class SearchMapListingPopover extends React.Component {
  render() {
    return <p>Hello there!</p>
  }
}

Object.assign(SearchMapListingPopover, {
  attachToMarker(marker, listing) {
    marker.addListener("click", this.showPopover.bind(this, marker, listing));
  },

  hidePopover() {
    if (!this.$mapMarker) return;

    if (!this.$mapMarker) {
      return;
    }

    // Return to old class style.
    this.$mapMarker.removeClass("open");
    this.$mapMarker.parent().parent().removeClass("open");

    // Remove React node here.
    ReactDOM.unmountComponentAtNode(this.$mapMarker[0]);

    // Ask marker to fill itself out again.
    this.marker.restore();

    // Reset instance variables.
    this.marker = null;
    this.$mapMarker = null;
    this.clickListener = null;
  },

  installBackgroundClickHandler() {
    // Only install once.
    if (this._backgroundClickHandler) {
      return;
    }

    // HACK to intercept clicks to dismiss the popover.
    let $backdrop = this.$markerWrapper.parent();
    $backdrop.css({ height: "100vh" });

    this._backgroundClickHandler = $backdrop.on("click", (e) => {
      if (this.$mapMarker === null) {
        // Nothing to hide.
        return;
      }

      if (this.$mapMarker[0] === e.target) {
        // IGNORE: event happened to map marker.
      } else if ($.contains(this.$mapMarker[0], e.target)) {
        // IGNORE: event is inside map marker.
      } else {
        this.hidePopover();
      }
    });
  },

  showPopover(marker, listing, event) {
    // If any popover is open, hide it first.
    this.hidePopover();

    this.marker = marker;
    // Sometimes event.target isn't set to the content div...
    this.$mapMarker = $(marker.markerContent_).find(".map-marker");
    // HACK: do need to make some changes to the wrapper.
    this.$markerWrapper = this.$mapMarker.parent().parent();

    // Remove listener on marker to show popover.
    google.maps.event.clearListeners(marker, 'click');

    // Add open for styling!
    this.$mapMarker.addClass("open");
    this.$markerWrapper.addClass("open");

    // HACK to stop doubleclicks from zooming the map.
    this.$markerWrapper.on("dblclick", (e) => e.stopPropagation());

    // HACK to make sure popover appears above other price markers.
    this.$markerWrapper.parent().append(this.$markerWrapper);

    // Render the popover into the marker.
    let listingElement = React.createElement(
      SearchListing.WrappedComponent, {
        listing: listing,
        focusListing: () => {} // Hack to prevent focusing
      }
    );

    ReactDOM.render(
      listingElement,
      this.$mapMarker[0]
    );

    // Dismiss popover on background click.
    this.installBackgroundClickHandler();
  }
});
