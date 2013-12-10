When /^I visit "(.*)\s*"$/ do |uri|
  visit "#{uri}"
  sleep 0.5
end

When(/^I visit the home page$/) do
  visit "/"
  sleep 0.5
end

Then /^I should( not)? see "([^"]*)"\s*$/ do |negative, text|
  if negative then
    page.should_not have_xpath(".//*[contains(text(),\"#{text}\")]", :visible => true)
  else
    page.should have_content(text)
  end
end

When /^I fill in "([^"]*)" with "([^"]*)"$/ do |page_el, arg|
  fill_in page_el, :with => arg
end

Then /^(?:I )?(?:click|click on) "([^"]*)"\s*$/ do |the_link|
  sleeping(2).seconds.between_tries.failing_after(5).tries do
    click_link_or_button(the_link)
  end
end

Then /^I pause "([^"]*)" seconds$/ do |tm_sec|
  puts ">>> sleeping #{tm_sec} <<<"
  sleep tm_sec.to_i
end

Given /^the following things:$/ do |things|
  geofactory = RGeo::Geographic.spherical_factory(:srid => 4326)
  things.hashes.each do |thing| 
    Thing.create!(location: geofactory.point(thing["longitude"], thing["latitude"]), name: thing["name"])
  end
end

Then(/^I should see "([^"]*)" things near me:$/) do |things_count, table|
  sleeping(2).seconds.between_tries.failing_after(5).tries do
    rows = find("#things-result-table").all('tr')
    (things_count + 1).should == rows.length
    actual_table = rows.map { |r| r.all('th,td').map { |c| c.text.strip } }

    actual_table = Cucumber::Ast::Table.new actual_table
    table.diff!(actual_table, :surplus_row => true, :surplus_col => true)
  end
end
