import AbstractView from '../framework/view/abstract-view.js';

export default class SortView extends AbstractView {
  get template() {
    return /* HTML */ `<form
      action="#"
      class="trip-events__trip-sort trip-sort"
      method="get"
    >
      <div class="trip-sort__item trip-sort__item--day">
        <input
          class="trip-sort__input visually-hidden"
          id="sort-day"
          name="trip-sort"
          type="radio"
          value="sort-day"
          checked=""
        />
        <label class="trip-sort__btn" for="sort-day"> Day </label>
      </div>
      <div class="trip-sort__item trip-sort__item--event">
        <input
          class="trip-sort__input visually-hidden"
          disabled=""
          id="sort-event"
          name="trip-sort"
          type="radio"
          value="sort-event"
        />
        <label class="trip-sort__btn" for="sort-event"> Event </label>
      </div>
      <div class="trip-sort__item trip-sort__item--time">
        <input
          class="trip-sort__input visually-hidden"
          id="sort-time"
          name="trip-sort"
          type="radio"
          value="sort-time"
        />
        <label class="trip-sort__btn" for="sort-time"> Time </label>
      </div>
      <div class="trip-sort__item trip-sort__item--price">
        <input
          checked=""
          class="trip-sort__input visually-hidden"
          id="sort-price"
          name="trip-sort"
          type="radio"
          value="sort-price"
        />
        <label class="trip-sort__btn" for="sort-price"> Price </label>
      </div>
      <div class="trip-sort__item trip-sort__item--offer">
        <input
          class="trip-sort__input visually-hidden"
          disabled=""
          id="sort-offer"
          name="trip-sort"
          type="radio"
          value="sort-offer"
        />
        <label class="trip-sort__btn" for="sort-offer"> Offers </label>
      </div>
    </form> `;
  }
}
