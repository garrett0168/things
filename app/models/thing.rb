class Thing < ActiveRecord::Base
  validates :name, :location, :presence => true
  set_rgeo_factory_for_column(:location, RGeo::Geographic.spherical_factory(:srid => 4326))

  scope :close_to, -> (longitude, latitude, distance_in_meters) {
    where(%{
      ST_DWithin(
        location,
        'POINT(%f %f)',
        %d
      )
    } % [longitude, latitude, distance_in_meters])
  }
end
