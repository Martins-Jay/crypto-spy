import { publish } from '../../helpers/pubsub.js';

class HomePublisher {
  constructor(parentSelector, channel) {
    this._parentEl = document.querySelector(parentSelector);
    this._channel = channel;
  }

  addHandlerClick() {
    this._parentEl.addEventListener('click', (e) => {
      const targetEl = e.target.closest('[data-action]');
      if (!targetEl) return;

      const action = targetEl.dataset.action;


      publish(this._channel, { action });
    });
  }
}

export const homePublisher = new HomePublisher('body', 'home:btn-clicked');

