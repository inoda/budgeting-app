Rails.application.routes.draw do
  root to: "sessions#new"

  resources :sessions, only: [:new, :create] do
    get :logout, on: :collection
  end

  resources :line_items, only: [:index]
  resources :reports, only: [:index]

  namespace :api do
    resources :line_items, only: [:index, :create, :destroy, :update]
    resources :expense_categories, only: [:index, :create, :destroy, :update]
  end
end
