class CreateThings < ActiveRecord::Migration
  def change
    enable_extension :postgis
    create_table :things do |t|
      t.string :name, null: false
      t.point :location, geographic: true, null: false

      t.timestamps
      t.index :location, :spatial => true
    end
  end
end
