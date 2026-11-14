import { render, remove } from '../framework/render.js';
import PointPresenter, { UserAction } from './point-presenter.js';
import ListEmptyView from '../view/list-empty-view.js';
import FormNewView from '../view/form-new-view.js';

const parseDateTime = (value) => {
  const [date, time] = value.split(' ');
  const [day, month, year] = date.split('/');
  const [hours, minutes] = time.split(':');

  return new Date(
    2000 + Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
  );
};

export default class RoutePresenter {
  #container;
  #model;
  #filterModel;
  #destinations;
  #offers;
  #newEventButton;
  #pointPresenters = [];
  #emptyView = null;
  #newPointView = null;

  constructor({
    container,
    model,
    filterModel,
    destinations,
    offers,
    newEventButton,
  }) {
    this.#container = container;
    this.#model = model;
    this.#filterModel = filterModel;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#newEventButton = newEventButton;
  }

  init() {
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#newEventButton.addEventListener('click', this.#handleNewEventClick);
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

    const points = this.#getPoints();

    if (points.length === 0) {
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

    points.forEach((point) => {
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

  #handlePointChange = (action, point) => {
    switch (action) {
      case UserAction.UPDATE:
        this.#model.updatePoint(point);
        break;
      case UserAction.ADD:
        this.#model.addPoint(point);
        break;
      case UserAction.DELETE:
        this.#model.deletePoint(point.id);
        break;
      default:
        return;
    }

    this.#renderPoints();
  };

  #handleModelEvent = () => {
    this.#renderPoints();
    this.#resetSort();
  };

  #resetSort() {
    const daySort = document.querySelector('#sort-day');
    if (daySort) {
      daySort.checked = true;
    }
  }

  #handleNewEventClick = () => {
    if (this.#newPointView) {
      return;
    }

    this.#resetAllPointPresenters();
    this.#filterModel.setFilter('everything');
    this.#resetSort();

    if (this.#emptyView) {
      remove(this.#emptyView);
      this.#emptyView = null;
    }
    this.#container.hidden = false;

    this.#newPointView = new FormNewView(
      this.#destinations,
      this.#offers,
      this.#handleNewPointSubmit,
      this.#closeNewPointForm,
    );

    render(this.#newPointView, this.#container, 'afterbegin');
    this.#newEventButton.disabled = true;
    document.addEventListener('keydown', this.#handleEscKeydown);
  };

  #handleNewPointSubmit = (formData, state) => {
    const destination = this.#destinations.find(
      (item) => item.name === formData.get('event-destination'),
    );

    if (!destination) {
      return;
    }

    const point = {
      id: crypto.randomUUID(),
      type: formData.get('event-type'),
      destination: destination.id,
      dateFrom: parseDateTime(formData.get('event-start-time')),
      dateTo: parseDateTime(formData.get('event-end-time')),
      basePrice: Number(formData.get('event-price')),
      offers: state.offers,
      isFavorite: false,
    };

    this.#handlePointChange(UserAction.ADD, point);
    this.#closeNewPointForm();
  };

  #closeNewPointForm = () => {
    if (!this.#newPointView) {
      return;
    }

    remove(this.#newPointView);
    this.#newPointView = null;
    this.#newEventButton.disabled = false;
    document.removeEventListener('keydown', this.#handleEscKeydown);
    this.#renderPoints();
  };

  #handleEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      this.#closeNewPointForm();
    }
  };
}
