Rails.application.routes.draw do
  get "search", to: "site#search", format: :html
  # POST for a search request because payload may be large.
  post "search", to: "site#search", format: :json

  root to: "site#home"
end
