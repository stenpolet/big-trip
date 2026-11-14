import PointPresenter from './point-presenter.js';

export default class RoutePresenter {
  #container;
  #model;
  #points;
  #destinations;
  #offers;
  #pointPresenters = [];

  constructor({ container, model, destinations, offers }) {
    this.#container = container;
    this.#model = model;
    this.#points = model.getPoints();
    this.#destinations = destinations;
    this.#offers = offers;
  }

  init() {
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
    const pointIndex = this.#points.findIndex(
      (point) => point.id === updatedPoint.id,
    );

    if (pointIndex === -1) {
      return;
    }

    this.#model.updatePoint(updatedPoint);
    this.#points = this.#model.getPoints();
    this.#pointPresenters[pointIndex].update(this.#points[pointIndex]);
  };
}
