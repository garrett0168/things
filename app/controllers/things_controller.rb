class ThingsController < ApplicationController

  def search
    total_per_page = params[:per_page] || 10
    page = params[:page] || 1
    begin
      things = Thing.close_to(params[:longitude], params[:latitude], params[:distance])
      total_things = things.count
      respond_to do |format|
        format.json { render json: {total: total_things, things: things.offset(total_per_page.to_i  * (page.to_i - 1)).limit(total_per_page.to_i).as_json(:only => [:name, :location, :id])} }
      end
    rescue => e
      Rails.logger.error e.backtrace
      Rails.logger.error e.message
      respond_to do |format|
        format.json { render json: {message: e.message}, status: 500 }
      end
    end
  end

end
