class SiteController < ApplicationController
  def home
    render :home
  end

  def search
    render json: params["search"]
  end
end
