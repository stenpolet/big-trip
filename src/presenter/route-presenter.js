import { render, remove } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import ListEmptyView from '../view/list-empty-view.js';

export default class RoutePresenter {
  #container;
  #model;
  #filterModel;
  #points = [];
  #destinations;
  #offers;
  #pointPresenters = [];
  #emptyView = null;

  constructor({ container, model, filterModel, destinations, offers }) {
    this.#container = container;
    this.#model = model;
    this.#filterModel = filterModel;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  init() {
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#renderPoints();
  }

  #getPoints() {
    const points = this.#model.getPoints();
    const filter = this.#filterModel.getFilter();
    const now = new Date();

    switch (filter) {
      case 'future':
        return points.filter((point) => new Date(point.dateFrom) > now);
      case 'present':
        return points.filter(
          (point) =>
            new Date(point.dateFrom) <= now && new Date(point.dateTo) >= now,
        );
      case 'past':
        return points.filter((point) => new Date(point.dateTo) < now);
      case 'everything':
      default:
        return points;
    }
  }

  #renderPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#pointPresenters = [];

    this.#container
      .querySelectorAll('.event:not(.event--edit)')
      .forEach((element) => element.closest('.trip-events__item')?.remove());

    this.#points = this.#getPoints();

    if (this.#points.length === 0) {
      this.#container.hidden = true;

      if (this.#emptyView) {
        remove(this.#emptyView);
      }

      this.#emptyView = new ListEmptyView(this.#filterModel.getFilter());
      render(this.#emptyView, this.#container.parentElement);
      return;
    }

    this.#container.hidden = false;

    if (this.#emptyView) {
      remove(this.#emptyView);
      this.#emptyView = null;
    }

    this.#points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        point,
        destinations: this.#destinations,
        offers: this.#offers,
        container: this.#container,
        onDataChange: this.#handlePointChange,
        onEditStart: this.#resetAllPointPresenters,
      });

      this.#pointPresenters.push(pointPresenter);
      pointPresenter.init();
    });
  }

  #resetAllPointPresenters = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    const pointExists = this.#model
      .getPoints()
      .some((point) => point.id === updatedPoint.id);

    if (!pointExists) {
      return;
    }

    this.#model.updatePoint(updatedPoint);
    this.#renderPoints();
  };

  #handleModelEvent = () => {
    this.#renderPoints();

    const daySort = document.querySelector('#sort-day');
    if (daySort) {
      daySort.checked = true;
    }
  };
}
