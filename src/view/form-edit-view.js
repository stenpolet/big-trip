import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { POINT_TYPES } from '../mock/point.js';

const formatDateTime = (date) => {
  if (!date) {
    return '';
  }

  const value = new Date(date);
  const pad = (number) => String(number).padStart(2, '0');

  return `${pad(value.getDate())}/${pad(value.getMonth() + 1)}/${String(
    value.getFullYear(),
  ).slice(-2)} ${pad(value.getHours())}:${pad(value.getMinutes())}`;
};

export default class FormEditView extends AbstractStatefulView {
  #id = crypto.randomUUID();

  #point;
  #destinations;
  #offers;

  #handleFormSubmit;
  #handleRollupClick;
  #handleTypeChange;
  #handleDestinationChange;
  #handleOfferChange;
  #handleDeleteClick;

  constructor(
    point = null,
    destinations = [],
    offers = [],
    onFormSubmit,
    onRollupClick,
    onDeleteClick,
  ) {
    super();

    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;

    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleTypeChange = this.#onTypeChange.bind(this);
    this.#handleDestinationChange = this.#onDestinationChange.bind(this);
    this.#handleOfferChange = this.#onOfferChange.bind(this);

    this._state = {
      type: point?.type ?? 'flight',
      offers: point?.offers ?? [],
      destination: point?.destination ?? '',
      destinationName:
        destinations.find((item) => item.id === point?.destination)?.name ?? '',
    };

    this._restoreHandlers();
  }

  get template() {
    const point = this.#point ?? {
      type: 'flight',
      destination: '',
      dateFrom: '',
      dateTo: '',
      basePrice: '',
      offers: [],
      isFavorite: false,
    };

    const type = this._state.type;
    const selectedOffers = this._state.offers;

    const destination =
      this.#destinations.find((item) => item.id === this._state.destination) ??
      this.#destinations.find(
        (item) => item.name === this._state.destinationName,
      );

    const picturesTemplate = (destination?.pictures ?? [])
      .map(
        (picture) => `
          <img
            class="event__photo"
            src="${picture.src}"
            alt="${picture.description}"
          />
        `,
      )
      .join('');

    const availableOffers = this.#offers.filter((offer) => offer.type === type);

    const typeOptions = POINT_TYPES.map(
      (pointType) => `
        <div class="event__type-item">
          <input
            class="event__type-input visually-hidden"
            id="${this.#id}-type-${pointType}"
            name="event-type"
            type="radio"
            value="${pointType}"
            ${type === pointType ? 'checked' : ''}
          />
          <label
            class="event__type-label event__type-label--${pointType}"
            for="${this.#id}-type-${pointType}"
          >
            ${pointType[0].toUpperCase() + pointType.slice(1)}
          </label>
        </div>
      `,
    ).join('');

    const destinationOptions = this.#destinations
      .map((item) => `<option value="${item.name}"></option>`)
      .join('');

    const offersTemplate = availableOffers
      .map(
        (offer) => `
          <div class="event__offer-selector">
            <input
              class="event__offer-checkbox visually-hidden"
              id="${this.#id}-offer-${offer.id}"
              data-offer-id="${offer.id}"
              name="event-offer-${offer.id}"
              type="checkbox"
              ${
  selectedOffers.some((id) => String(id) === String(offer.id))
    ? 'checked'
    : ''
}
            />
            <label
              class="event__offer-label"
              for="${this.#id}-offer-${offer.id}"
            >
              <span class="event__offer-title">${offer.title}</span>
              +€
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>
        `,
      )
      .join('');

    return /* HTML */ `
      <li class="trip-events__item">
        <form action="#" class="event event--edit" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label
                class="event__type event__type-btn"
                for="${this.#id}-type-toggle"
              >
                <span class="visually-hidden">Choose event type</span>
                <img
                  alt="Event type icon"
                  class="event__type-icon"
                  height="17"
                  src="img/icons/${type}.png"
                  width="17"
                />
              </label>
              <input
                class="event__type-toggle visually-hidden"
                id="${this.#id}-type-toggle"
                type="checkbox"
              />
              <div class="event__type-list">
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Event type</legend>
                  ${typeOptions}
                </fieldset>
              </div>
            </div>

            <div class="event__field-group event__field-group--destination">
              <label
                class="event__label event__type-output"
                for="${this.#id}-destination"
              >
                ${type[0].toUpperCase() + type.slice(1)}
              </label>
              <input
                class="event__input event__input--destination"
                id="${this.#id}-destination"
                list="${this.#id}-destination-list"
                name="event-destination"
                type="text"
                value="${this._state.destinationName ?? destination?.name ?? ''}"
              />
              <datalist id="${this.#id}-destination-list">
                ${destinationOptions}
              </datalist>
            </div>

            <div class="event__field-group event__field-group--time">
              <label class="visually-hidden" for="${this.#id}-start-time">
                From
              </label>
              <input
                class="event__input event__input--time"
                id="${this.#id}-start-time"
                name="event-start-time"
                type="text"
                value="${this._state.dateFrom ?? formatDateTime(point.dateFrom)}"
              />
              —
              <label class="visually-hidden" for="${this.#id}-end-time">
                To
              </label>
              <input
                class="event__input event__input--time"
                id="${this.#id}-end-time"
                name="event-end-time"
                type="text"
                value="${this._state.dateTo ?? formatDateTime(point.dateTo)}"
              />
            </div>

            <div class="event__field-group event__field-group--price">
              <label class="event__label" for="${this.#id}-price">
                <span class="visually-hidden">Price</span>
                €
              </label>
              <input
                class="event__input event__input--price"
                id="${this.#id}-price"
                name="event-price"
                type="number"
                min="0"
                value="${this._state.basePrice ?? point.basePrice}"
                required
              />
            </div>

            <button class="event__save-btn btn btn--blue" type="submit">
              Save
            </button>
            <button class="event__reset-btn" type="reset">
              ${this.#point ? 'Delete' : 'Cancel'}
            </button>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Close event</span>
            </button>
          </header>

          <section class="event__details">
            <section class="event__section event__section--offers">
              <h3 class="event__section-title event__section-title--offers">
                Offers
              </h3>
              <div class="event__available-offers">${offersTemplate}</div>
            </section>

            <section class="event__section event__section--destination">
              <h3
                class="event__section-title event__section-title--destination"
              >
                Destination
              </h3>
              <p class="event__destination-description">
                ${destination?.description ?? ''}
              </p>
              <div class="event__photos-container">
                <div class="event__photos-tape">${picturesTemplate}</div>
              </div>
            </section>
          </section>
        </form>
      </li>
    `;
  }

  #onTypeChange(evt) {
    this.#updatePointData();

    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  }

  #onDestinationChange(evt) {
    const destination = this.#destinations.find(
      (item) => item.name === evt.target.value,
    );

    if (!destination) {
      return;
    }

    this.#updatePointData();

    this.updateElement({
      destination: destination.id,
    });
  }

  #onOfferChange(evt) {
    const offerId = evt.target.dataset.offerId;

    const offers = evt.target.checked
      ? [...this._state.offers, offerId]
      : this._state.offers.filter((id) => String(id) !== offerId);

    this._setState({ offers });
  }

  #updatePointData() {
    const formData = new FormData(this.element.querySelector('form'));

    this._setState({
      basePrice: formData.get('event-price'),
      dateFrom: formData.get('event-start-time'),
      dateTo: formData.get('event-end-time'),
      destinationName: formData.get('event-destination'),
    });
  }

  _restoreHandlers() {
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#handleFormSubmit);

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#handleDeleteClick);

    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#handleRollupClick);

    this.element
      .querySelectorAll('.event__type-input')
      .forEach((input) =>
        input.addEventListener('change', this.#handleTypeChange),
      );

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#handleDestinationChange);

    this.element
      .querySelectorAll('.event__offer-checkbox')
      .forEach((input) =>
        input.addEventListener('change', this.#handleOfferChange),
      );
  }
}
