function initSearch () {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({'address': gon.search.location}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      let map = new google.maps.Map(document.getElementById("map"), {
        center: {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        },
        disableDefaultUI: true,
        zoomControl: true,
        zoom: 12
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });

  var slider = document.getElementById('price-range');
  noUiSlider.create(slider, {
    start: [20, 80],
    connect: true,
    range: {
      'min': 0,
      'max': 100
    }
  });
}
