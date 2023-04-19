Rails.application.routes.draw do
  root to: "sessions#new"

  resources :sessions, only: [:new, :create] do
    get :logout, on: :collection
  end

  resources :line_items, only: [:index]
  resources :reports, only: [:index]
  resources :ontrack_imports, only: [:new, :create]

  namespace :api do
    resources :line_items, only: [:index, :create, :destroy, :update] do
      post :upload, on: :collection
      post :bulk_create, on: :collection
    end

    resources :reports, only: [:index]

    resources :expense_categories, only: [:index]
  end
end
