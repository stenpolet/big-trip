import { render } from '../framework/render.js';
import FilterView from '../view/filter-view.js';

export default class FilterPresenter {
  #container;
  #model;

  constructor({ container, model }) {
    this.#container = container;
    this.#model = model;
  }

  init() {
    const filterView = new FilterView(
      this.#handleFilterChange,
      this.#model.getFilter(),
    );

    render(filterView, this.#container);
  }

  #handleFilterChange = (filter) => {
    this.#model.setFilter(filter);
  };
}
