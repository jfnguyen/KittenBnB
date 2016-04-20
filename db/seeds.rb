# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Dir["./app/assets/images/portraits/*jpg"].map do |path|
  path.split("/").last
end.each do |name|
  name.chomp!(".jpg")
  Host.create!(
    fname: name,
    portrait_path: "portraits/#{name}.jpg"
  )
end
