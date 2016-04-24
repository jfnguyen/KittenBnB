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
    if (!this.marker) return;

    // Remove React node here.
    ReactDOM.unmountComponentAtNode(this.marker.markerContent_);

    // Ask marker to fill itself out again.
    this.marker.restore();

    // Reset instance variables.
    this.marker = null;

    // Cleanup this the dismissal click listener.
    this._mapClickListener.remove();
    this._mapClickListener = null;
  },

  // HACK! This is really terrible, but the only way I can figure out.
  ignoreCurrentEvent() {
    this._ignoreCurrentEvent = true;
    // When done processing this event, don't ignore more events!

    _.defer(() => { this._ignoreCurrentEvent = false });
  },

  showPopover(marker, listing, event) {
    // If any popover is open, hide it first.
    this.hidePopover();

    this.marker = marker;
    // Sometimes event.target isn't set to the content div...
    let $mapMarker = $(marker.markerContent_).find(".map-marker");
    // HACK: do need to make some changes to the wrapper.
    let $markerWrapper = $mapMarker.parent().parent();

    // Remove listener on marker to show popover.
    google.maps.event.clearListeners(marker, 'click');

    // Add open for styling!
    $mapMarker.addClass("open");
    $markerWrapper.addClass("open");

    // HACK to stop doubleclicks from zooming the map.
    $markerWrapper.on("dblclick", (e) => e.stopPropagation());

    // HACK to make sure popover appears above other price markers.
    $markerWrapper.parent().append($markerWrapper);

    // Render the popover into the marker.
    let listingElement = React.createElement(
      SearchListing.WrappedComponent, {
        listing: listing,
        focusListing: () => {} // Hack to prevent focusing
      }
    );

    // Set map up to hide popover on click outside the popover. This is
    // hard because there's no way to get the event in Google's listener
    // class...
    this._mapClickListener = marker.map.addListener("click", () => {
      if (this._ignoreCurrentEvent) {
        return;
      } else {
        this.hidePopover();
      }
    });

    // Because events will bubble to map, we need to be careful clicks
    // within the popover don't trigger it to hide. We'd use
    // stopPropagation, but React needs propagation to body where it
    // captures events.
    $mapMarker.on("click", (event) => {
      this.ignoreCurrentEvent();
    });
    // This very click shouldn't hide the popover we've just shown!
    this.ignoreCurrentEvent();

    ReactDOM.render(
      listingElement,
      $mapMarker[0]
    );
  }
});
