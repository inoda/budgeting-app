module Api
  class LineItemsController < BaseController
    def index
      items = ::LineItem.all
      opts = {}

      if params[:include_category] == true.to_s
        items = items.includes(:expense_category)
      end

      if params[:transaction_date_min].present?
        items = items.where('transaction_date >= ?', Time.at(params[:transaction_date_min].to_i).to_datetime)
      end

      if params[:transaction_date_max].present?
        items = items.where('transaction_date <= ?', Time.at(params[:transaction_date_max].to_i).to_datetime)
      end

      if params[:search]&.strip.present?
        items = items.left_outer_joins(:expense_category)
        items = items.where("lower(memo) ILIKE ? OR lower(expense_categories.name) ILIKE ?", "%#{params[:search].strip}%", "%#{params[:search].strip}%")
      end

      if params[:sort]
        items = items.order(normalized_sort(params[:sort], params[:sort_desc])).order(id: :desc) if params[:sort]
      end

      if params[:include_category] == true.to_s
        opts = { include: :expense_category }
      end

      resp = items.paginate(params[:page] || 1, params[:per_page] || 100)
      paginated_response(resp, opts)
    end

    def destroy
      item = ::LineItem.find_by(id: params[:id])
      successful = item&.destroy || item.nil?
      render json: nil, status: successful ? 200 : 500
    end

    private

    def normalized_sort(key, sort_desc)
      cols = { transaction_date: "transaction_date", amount: "amount" }
      col = cols[key.to_sym] || "transaction_date"
      dir = sort_desc == "true" ? "DESC" : "ASC"
      "#{col} #{dir}"
    end
  end
end
