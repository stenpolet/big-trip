import AbstractView from '../framework/view/abstract-view.js';

export default class FilterView extends AbstractView {
  #onFilterChange;

  constructor(onFilterChange, activeFilter) {
    super();
    this.#onFilterChange = onFilterChange;

    this.element.addEventListener('change', this.#handleFilterChange);

    const activeInput = this.element.querySelector(
      `[name="trip-filter"][value="${activeFilter}"]`,
    );

    if (activeInput) {
      activeInput.checked = true;
    }
  }

  #handleFilterChange = (evt) => {
    if (evt.target.matches('[name="trip-filter"]')) {
      this.#onFilterChange(evt.target.value);
    }
  };

  get template() {
    return /* HTML */ `<form action="#" class="trip-filters" method="get">
      <div class="trip-filters__filter">
        <input
          checked=""
          class="trip-filters__filter-input visually-hidden"
          id="filter-everything"
          name="trip-filter"
          type="radio"
          value="everything"
        />
        <label class="trip-filters__filter-label" for="filter-everything">
          Everything
        </label>
      </div>
      <div class="trip-filters__filter">
        <input
          class="trip-filters__filter-input visually-hidden"
          id="filter-future"
          name="trip-filter"
          type="radio"
          value="future"
        />
        <label class="trip-filters__filter-label" for="filter-future">
          Future
        </label>
      </div>
      <div class="trip-filters__filter">
        <input
          class="trip-filters__filter-input visually-hidden"
          id="filter-present"
          name="trip-filter"
          type="radio"
          value="present"
        />
        <label class="trip-filters__filter-label" for="filter-present">
          Present
        </label>
      </div>
      <div class="trip-filters__filter">
        <input
          class="trip-filters__filter-input visually-hidden"
          id="filter-past"
          name="trip-filter"
          type="radio"
          value="past"
        />
        <label class="trip-filters__filter-label" for="filter-past">
          Past
        </label>
      </div>
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form> `;
  }
}
