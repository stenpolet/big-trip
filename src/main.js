import { RenderPosition, render } from './framework/render.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import FormNewView from './view/form-new-view.js';
import EventsListView from './view/events-list-view.js';
import RoutePresenter from './presenter/route-presenter.js';
import Model from './model/model.js';

const model = new Model();

const destinations = model.getDestinations();
const offers = model.getOffers();

const tripControlsContainer = document.querySelector('.trip-controls__filters');
render(new FilterView(), tripControlsContainer);

const tripEventsContainer = document.querySelector('.trip-events');
render(new SortView(), tripEventsContainer, RenderPosition.AFTERBEGIN);

const eventsList = new EventsListView();
render(eventsList, tripEventsContainer);

render(new FormNewView(destinations, offers), eventsList.element);

const routePresenter = new RoutePresenter({
  container: eventsList.element,
  model,
  destinations,
  offers,
});

routePresenter.init();
