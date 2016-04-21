json.array! @listings do |listing|
  json.extract! listing, :id, :latitude, :longitude, :title

  json.hostPortraitPath (asset_url listing.host.portrait_path)
  json.imagePaths (listing.image_paths.map { |ip| asset_url ip })
  json.pricePerNight listing.price_per_night
  json.roomType listing.room_type
end
