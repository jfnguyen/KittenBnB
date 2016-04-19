class SiteController < ApplicationController
  def home
    render :home
  end

  def search
    @search_params = params.require(:search)
    respond_to do |format|
      format.html do
        gon.search = params.require(:search)
        render :search
      end

      format.json do
        render json: []
      end
    end
  end
end
