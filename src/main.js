import { RenderPosition, render } from './framework/render.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import SortView from './view/sort-view.js';
import EventsListView from './view/events-list-view.js';
import RoutePresenter from './presenter/route-presenter.js';
import Model from './model/model.js';

const model = new Model();
const filterModel = new FilterModel();

const destinations = model.getDestinations();
const offers = model.getOffers();

const tripControlsContainer = document.querySelector('.trip-controls__filters');
const filterPresenter = new FilterPresenter({
  container: tripControlsContainer,
  model: filterModel,
});
filterPresenter.init();

const tripEventsContainer = document.querySelector('.trip-events');
render(new SortView(), tripEventsContainer, RenderPosition.AFTERBEGIN);

const eventsList = new EventsListView();
render(eventsList, tripEventsContainer);

const routePresenter = new RoutePresenter({
  container: eventsList.element,
  model,
  filterModel,
  destinations,
  offers,
  newEventButton: document.querySelector('.trip-main__event-add-btn'),
});

routePresenter.init();
