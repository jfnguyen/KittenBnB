class CreateListings < ActiveRecord::Migration
  def change
    create_table :listings do |t|
      t.integer :host_id, null: false
      t.float :latitude, null: false
      t.float :longitude, null: false
      t.integer :max_num_guests, null: false
      t.integer :num_bedrooms, null: false
      t.integer :num_beds, null: false
      t.integer :price_per_night, null: false
      t.string :room_type, null: false
      t.string :image_paths, array: true, default: []

      t.timestamps null: false
    end
  end
end
