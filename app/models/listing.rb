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
    results = self

    room_type_vals = { entire_home: "entireHome",
      private_room: "privateRoom",
      shared_room: "sharedRoom" }.map do |(key, val)|
      [key, search_params[val] == "true"]
    end

    p room_type_vals

    if !room_type_vals.none? { |(type, val)| val }
      selected_room_type_vals = room_type_vals.select do |(type, val)|
        val
      end.map { |(type, _)| type }
      results = results.where("room_type IN (?)", selected_room_type_vals)
    end

    results = results
              .where("? <= max_num_guests", search_params["numGuests"])
              .where("? <= price_per_night", search_params["minPrice"].to_i)
              .where("price_per_night < ?", search_params["maxPrice"].to_i)
              .where("? <= max_num_guests", search_params["numGuests"].to_i)

    lats = [search_params["geoBounds"]["northEast"]["lat"].to_f,
            search_params["geoBounds"]["southWest"]["lat"].to_f].sort!
    lngs = [search_params["geoBounds"]["northEast"]["lng"].to_f,
            search_params["geoBounds"]["southWest"]["lng"].to_f].sort!

    results = results
              .where("latitude BETWEEN ? AND ?", *lats)
              .where("longitude BETWEEN ? AND ?", *lngs)

    results
  end
end
