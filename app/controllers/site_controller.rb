class SiteController < ApplicationController
  def home
    render :home
  end

  def search
    @search_params = params.require(:search)
    respond_to do |format|
      format.html do
        gon.search = search_params
        render :search
      end

      format.json do
        @listings = Listing.search_force_results(@search_params)
        render "listings"
      end
    end
  end

  private
  def search_params
    _search_params = params.require(:search)
    ["entireHome", "privateRoom", "sharedRoom"].each do |f|

      _search_params[f] = (_search_params[f] == "true")
    end

    ["numGuests", "maxPrice", "minPrice"].each do |f|
      next unless _search_params.has_key?(f)
      _search_params[f] = Integer(_search_params[f])
    end

    _search_params
  end
end
