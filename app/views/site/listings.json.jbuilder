json.array! @listings do |listing|
  json.extract! listing, :id, :latitude, :longitude, :title

  json.hostPortraitPath (asset_url listing.host.portrait_path)
  json.imagePaths (listing.image_paths.map { |ip| asset_url ip })
  # TODO: Fix me!
  json.rating rand(1..10)
  json.pricePerNight listing.price_per_night
  json.roomType listing.room_type
end
