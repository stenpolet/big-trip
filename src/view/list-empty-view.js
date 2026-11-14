import AbstractView from '../framework/view/abstract-view.js';

const EmptyMessage = {
  everything: 'Click New Event to create your first point',
  future: 'There are no future events now',
  present: 'There are no present events now',
  past: 'There are no past events now',
};

export default class ListEmptyView extends AbstractView {
  #filter;

  constructor(filter) {
    super();
    this.#filter = filter;
  }

  get template() {
    return `<p class="trip-events__msg">${EmptyMessage[this.#filter]}</p>`;
  }
}
