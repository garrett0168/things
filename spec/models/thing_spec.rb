require 'spec_helper'

describe Thing do
  it "is not valid without a name" do
    thing = Thing.new
    thing.should have(1).error_on(:name)
  end

  it "is not valid without a location" do
    thing = Thing.new
    thing.should have(1).error_on(:location)
  end

  it "can find things close by" do
    geofactory = RGeo::Geographic.spherical_factory(:srid => 4326)
    far_thing = Thing.create!(
      name:      "Far away thing",
      location:  geofactory.point(-77.000, 40.000)
    )

    close_thing = Thing.create!(
      name:      "Close by thing",
      location:  geofactory.point(-75.990, 39.010)
    )
    close_things = Thing.close_to(-76.000, 39.000, 2000.0).load

    assert_equal 1, close_things.size
    assert_equal close_thing, close_things.first
  end
end
