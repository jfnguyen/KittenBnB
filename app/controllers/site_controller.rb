class SiteController < ApplicationController
  def home
    render :home
  end

  def search
    @lat_lng = JSON.parse params.require(:search).require("location-lat-lng")
    render :search
  end
end
