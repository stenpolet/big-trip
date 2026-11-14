import { points, destinations, offers } from '../mock/mock.js';

class Model {
  #points = points;
  #destinations = destinations;
  #offers = offers;

  getPoints() {
    return this.#points;
  }

  setPoints(newPoints) {
    this.#points = newPoints;
  }

  updatePoint(updatedPoint) {
    const pointIndex = this.#points.findIndex(
      (point) => point.id === updatedPoint.id,
    );

    if (pointIndex === -1) {
      return;
    }

    this.#points = [
      ...this.#points.slice(0, pointIndex),
      updatedPoint,
      ...this.#points.slice(pointIndex + 1),
    ];
  }

  getDestinations() {
    return this.#destinations;
  }

  getOffers() {
    return this.#offers;
  }
}

export default Model;
