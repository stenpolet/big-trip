import Observable from '../framework/observable.js';

export default class FilterModel extends Observable {
  #filter = 'everything';

  getFilter() {
    return this.#filter;
  }

  setFilter(filter) {
    if (this.#filter === filter) {
      return;
    }

    this.#filter = filter;
    this._notify('change');
  }
}
