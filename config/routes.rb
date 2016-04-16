Rails.application.routes.draw do
  get "search", to: "site#search"

  root to: "site#home"
end
