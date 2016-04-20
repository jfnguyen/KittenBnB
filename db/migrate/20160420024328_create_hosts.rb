class CreateHosts < ActiveRecord::Migration
  def change
    create_table :hosts do |t|
      t.string :fname, null: false
      t.string :portrait_path, null: false

      t.timestamps null: false
    end
  end
end
