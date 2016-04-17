class SiteController < ApplicationController
  def home
    render :home
  end

  def search
    render json: params.require(:search)
  end
end
