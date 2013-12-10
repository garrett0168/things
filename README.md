things
======

Prerequisites
=============

* ruby 2.0.0 (Use rvm)
* PostgreSQL and PostGIS
  - MAC: [http://postgresapp.com/](Postgresapp)
  - Ubuntu: 
    * Edit /etc/apt/sources.list.d/pgdg.list and paste:

      `deb http://apt.postgresql.org/pub/repos/apt/ YOUR_UBUNTU_VERSION_HERE-pgdg main`
 
      Then, import the repository key:

      `wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | \
       sudo apt-key add -
       sudo apt-get update`

      Finally, install PostgreSQL 9.2, the contrib package, and PostGIS 2.0 scripts:

      `sudo apt-get install postgresql-9.2 postgresql-contrib-9.2 postgresql-server-dev-9.2 postgresql-9.2-postgis-2.0-scripts postgresql-9.2-postgis-2.0`

For testing:

* [PhantomJS (1.9.0 or above)](http://phantomjs.org/download.html) Extract and put bin/phantomjs in your path.
* [Karma](http://karma-runner.github.io)

Setup
=====

1. `bundle install`
2. `bundle exec rake db:create`
3. `bundle exec rake db:migrate`
4. `RAILS_ENV=test bundle exec rake db:migrate`

Seeding the database
====================

Connect to your postgres server (`psql -U postgres things_development`) and run the following command to seed your database with 10 million random things:

```
insert into things(name, geo_point) (
select 'Thing' || i as name, ST_GeomFromText('POINT(' || x.lon || ' ' || x.lat || ')') as location
from (
select i, (random() * 180) - 90 as lat, (random() * 360) - 180 as lon
from generate_series(1, 100) as i
)
as x);
```

*NOTE:* This might take up to half an hour.

Running Tests
=============

Rspec tests:

`bundle exec rspec`

Cucumber tests:

`bundle exec cucumber`

Karma tests:

`karma start spec/karma/config/karma.js`

Starting the server
===================

`bundle exec rails server`
