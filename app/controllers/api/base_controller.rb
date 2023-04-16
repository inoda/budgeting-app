module Api
  class BaseController < ApplicationController
    def paginated_response(query, json_opts = {})
      page = query.page
      per_page = query.per_page
      total = query.total_items
      total_pages = query.total_pages
      items = query

      render json: {
        items: items.as_json(json_opts),
        pagination_data: { page: page, per_page: per_page, total_items: total, total_pages: total_pages }
      }
    end

    def page
      params[:page] || 1
    end

    def per_page
      params[:per_page] || 100
    end
  end
end
