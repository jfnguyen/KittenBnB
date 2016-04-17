class SiteController < ApplicationController
  def home
    render :home
  end

  def search
    @search_params = params.require(:search)
    gon.search = params.require(:search)
    render :search
  end
end
