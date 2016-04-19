class Listing < ActiveRecord::Base
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

    results
  end

  def self.search_force_results(search_params)
    listings = self.search(search_params).to_a
    until listings.length >= 20
      lats, lngs = get_bounds(search_params)

      max_num_guests = search_params["numGuests"].to_i
      num_beds = max_num_guests.fdiv(2).ceil
      num_bedrooms = rand(1..num_beds)

      min_price = search_params["minPrice"].to_f
      max_price = search_params["maxPrice"].to_f
      price_per_night = min_price + (rand * (max_price - min_price))

      listings << Listing.create!(
        host_id: rand(1000),
        latitude: lats[0] + (rand * (lats[1] - lats[0])),
        longitude: lngs[0] + (rand * (lngs[1] - lngs[0])),
        max_num_guests: max_num_guests,
        num_bedrooms: num_bedrooms,
        num_beds: num_beds,
        price_per_night: price_per_night,
        room_type: get_room_types(search_params).sample
      )
    end

    listings
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
