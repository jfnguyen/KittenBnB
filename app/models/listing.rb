class Listing < ActiveRecord::Base
  belongs_to :host

  validates(*[ :host_id,
               :latitude,
               :longitude,
               :max_num_guests,
               :num_bedrooms,
               :num_beds,
               :price_per_night,
               :room_type
             ], presence: true)

  def self.search(search_params)
    lats, lngs = get_bounds(search_params)

    results = self
              .where("room_type IN (?)", get_room_types(search_params))
              .where("? <= max_num_guests", search_params["numGuests"])
              .where("? <= price_per_night", search_params["minPrice"].to_i)
              .where("price_per_night < ?", search_params["maxPrice"].to_i)
              .where("? <= max_num_guests", search_params["numGuests"].to_i)
              .where("latitude BETWEEN ? AND ?", *lats)
              .where("longitude BETWEEN ? AND ?", *lngs)

    # I think ActiveRecord doesn't like to interpolate floats??  It
    # won't hurt too much to use `to_i` here instead.  This is
    # horrible; too lazy to sanitize, since order doesn't do it for
    # me...
    lat = search_params["geoCenter"]["lat"].to_f
    lng = search_params["geoCenter"]["lng"].to_f
    results = results.order(<<-SQL)
power(latitude - #{lat}, 2) + power(longitude - #{lng}, 2)
SQL

    results.to_a
  end

  def self.search_force_results(search_params)
    distFn = -> (listing) do
      lat = search_params["geoCenter"]["lat"].to_f
      lng = search_params["geoCenter"]["lng"].to_f

      ((listing.latitude - lat) ** 2 + (listing.longitude - lng) ** 2) ** 0.5
    end

    distFilterFn = -> (listing) do
      boundsWidth = (search_params["geoBounds"]["southWest"]["lng"].to_f
                     - search_params["geoBounds"]["northEast"]["lng"].to_f).abs
      dist = distFn.call(listing)
      dist < (0.5 * boundsWidth)
    end

    all_image_paths = Dir["app/assets/images/homes/*.png"].map! do |p|
      p.split("/")[-2..-1].join("/")
    end.shuffle!

    # Take only those listings pretty close to the center.
    listings = self.search(search_params).to_a
    good_listings_count = listings.count(&distFilterFn)

    # Create more listings if not enough are close to the center.
    candidateLocations = search_params["candidateLocations"].values
    host_ids = Host.pluck(:id)
    while true
      break if candidateLocations.empty?
      break if good_listings_count > 8

      location = candidateLocations.shift

      lat = location["lat"]
      lng = location["lng"]

      max_num_guests = search_params["numGuests"].to_i
      num_beds = max_num_guests.fdiv(2).ceil
      num_bedrooms = rand(1..num_beds)

      min_price = search_params["minPrice"].to_f
      max_price = search_params["maxPrice"].to_f
      price_per_night = min_price + (rand * (max_price - min_price))

      image_paths = all_image_paths.shift(3)
      all_image_paths += image_paths

      listing = Listing.new(
        host_id: host_ids.sample,
        latitude: lat,
        longitude: lng,
        max_num_guests: max_num_guests,
        num_bedrooms: num_bedrooms,
        num_beds: num_beds,
        price_per_night: price_per_night,
        room_type: get_room_types(search_params).sample,
        image_paths: image_paths,
        title: (0...8).map { ("A".ord + rand(26)).chr }.join,
      )

      if distFilterFn.call(listing)
        listing.save!
        listings << listing

        good_listings_count += 1
      end
    end

    listings.sort_by!(&:hash).take(20)
  end

  def self.get_bounds(search_params)
      lats = [search_params["geoBounds"]["northEast"]["lat"].to_f,
              search_params["geoBounds"]["southWest"]["lat"].to_f].sort!
      lngs = [search_params["geoBounds"]["northEast"]["lng"].to_f,
              search_params["geoBounds"]["southWest"]["lng"].to_f].sort!

      [lats, lngs]
  end

  def self.get_room_types(search_params)
    room_type_map = { entire_home: "entireHome",
                      private_room: "privateRoom",
                      shared_room: "sharedRoom" }
    room_type_vals = room_type_map.map do |(key, val)|
      [key, search_params[val] == "true"]
    end

    selected_room_types = room_type_vals.select do |(type, val)|
      val
    end.map { |(type, _)| type }

    selected_room_types.empty? ? room_type_map.keys : selected_room_types
  end
end
