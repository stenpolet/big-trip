import { render, replace } from '../framework/render.js';
import FormEditView from '../view/form-edit-view.js';
import PointView from '../view/point-view.js';

const UserAction = {
  UPDATE: 'UPDATE',
  ADD: 'ADD',
  DELETE: 'DELETE',
};

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

export default class PointPresenter {
  #point;
  #destinations;
  #offers;
  #container;
  #onDataChange;
  #pointView = null;
  #formEditView = null;
  #onEditStart;
  #isEditing = false;

  constructor({
    point,
    destinations,
    offers,
    container,
    onDataChange,
    onEditStart,
  }) {
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#container = container;
    this.#onDataChange = onDataChange;
    this.#onEditStart = onEditStart;
  }

  init() {
    this.#pointView = this.#createPointView();

    this.#formEditView = new FormEditView(
      this.#point,
      this.#destinations,
      this.#offers,
      this.#handleFormSubmit,
      this.#handleEditFormRollupClick,
      this.#handleDeleteClick,
    );

    render(this.#pointView, this.#container);
  }

  #createPointView() {
    return new PointView(
      this.#point,
      this.#destinations,
      this.#offers,
      this.#handleRollupClick,
      this.#handleFavoriteClick,
    );
  }

  update(point) {
    this.#point = point;

    const previousPointView = this.#pointView;
    this.#pointView = this.#createPointView();

    if (this.#isEditing) {
      replace(this.#pointView, this.#formEditView);
      document.removeEventListener('keydown', this.#handleEscKeydown);
      this.#isEditing = false;
      return;
    }

    replace(this.#pointView, previousPointView);
  }

  resetView() {
    if (!this.#isEditing) {
      return;
    }

    replace(this.#pointView, this.#formEditView);
    document.removeEventListener('keydown', this.#handleEscKeydown);
    this.#isEditing = false;
  }

  #handleFavoriteClick = (updatedPoint) => {
    this.#onDataChange(UserAction.UPDATE, updatedPoint);
  };

  #handleRollupClick = () => {
    this.#onEditStart();

    replace(this.#formEditView, this.#pointView);
    this.#isEditing = true;

    document.addEventListener('keydown', this.#handleEscKeydown);
  };

  #handleDeleteClick = (evt) => {
    evt.preventDefault();
    this.#onDataChange(UserAction.DELETE, this.#point);
  };

  #handleEditFormRollupClick = () => {
    replace(this.#pointView, this.#formEditView);
    document.removeEventListener('keydown', this.#handleEscKeydown);
    this.#isEditing = false;
  };

  #handleFormSubmit = (evt) => {
    evt.preventDefault();

    const form = this.#formEditView.element.querySelector('form');
    const formData = new FormData(form);

    const destination = this.#destinations.find(
      (item) => item.name === formData.get('event-destination'),
    );

    if (!destination) {
      return;
    }

    const selectedOffers = Array.from(
      form.querySelectorAll('.event__offer-checkbox:checked'),
      (input) => input.dataset.offerId,
    );

    const updatedPoint = {
      ...this.#point,
      type: form.querySelector('[name="event-type"]:checked').value,
      destination: destination.id,
      dateFrom: parseDateTime(formData.get('event-start-time')),
      dateTo: parseDateTime(formData.get('event-end-time')),
      basePrice: Number(formData.get('event-price')),
      offers: selectedOffers,
    };

    this.#onDataChange(UserAction.UPDATE, updatedPoint);
  };

  #handleEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      replace(this.#pointView, this.#formEditView);
      document.removeEventListener('keydown', this.#handleEscKeydown);
      this.#isEditing = false;
    }
  };
}

export { UserAction };
