json.array! @listings do |listing|
  json.extract! listing, :id, :latitude, :longitude

  json.imagePaths [(asset_url "5ca802f1_original.jpg")]
  json.pricePerNight listing.price_per_night

  json.hostPortraitPath (asset_url listing.host.portrait_path)

  json.roomType listing.room_type
end
