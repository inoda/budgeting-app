import RestResource from './utilities/rest_resource';

const LineItems = new RestResource('/line_items');
const ExpenseCategories = new RestResource('/expense_categories');
const Reports = new RestResource('/reports');

export {
  LineItems,
  ExpenseCategories,
  Reports,
};
