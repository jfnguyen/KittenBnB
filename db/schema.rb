# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160420024328) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "hosts", force: :cascade do |t|
    t.string   "fname",         null: false
    t.string   "portrait_path", null: false
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "listings", force: :cascade do |t|
    t.integer  "host_id",                      null: false
    t.float    "latitude",                     null: false
    t.float    "longitude",                    null: false
    t.integer  "max_num_guests",               null: false
    t.integer  "num_bedrooms",                 null: false
    t.integer  "num_beds",                     null: false
    t.integer  "price_per_night",              null: false
    t.string   "room_type",                    null: false
    t.string   "title",                        null: false
    t.string   "image_paths",     default: [],              array: true
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
  end

end
