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

    // Set map up to hide popover on click outside the popover. This is
    // hard because there's no way to get the event in Google's listener
    // class...
    this._mapClickListener = marker.map.addListener("click", () => {
      console.log("w?");
      if (this._ignoreCurrentEvent) {
        return;
      } else {
        this.hidePopover();
      }

      // Cleanup this listener.
      this._mapClickListener.remove();
      this._mapClickListener = null;
    });

    // Because events will bubble to map, we need to be careful clicks
    // within the popover don't trigger it to hide. We'd use
    // stopPropagation, but React needs propagation to body where it
    // captures events.
    this.$mapMarker.on("click", (event) =>{
      this.ignoreCurrentEvent();
    });
    // This very click shouldn't hide the popover we've just shown!
    this.ignoreCurrentEvent();

    ReactDOM.render(
      listingElement,
      this.$mapMarker[0]
    );
  }
});
