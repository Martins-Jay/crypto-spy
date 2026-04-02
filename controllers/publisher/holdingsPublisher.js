import { publish } from '../../helpers/pubsub.js';

class HoldingsPublisher {
  constructor(parentSelector, channel) {
    this._parentEL = document.querySelector(parentSelector);
    this._channel = channel;
  }

  addHandlerClick() {
    this._parentEL.addEventListener('click', (e) => {
      const targetEl = e.target.closest('[data-action]');
      if (!targetEl) return;

      const action = targetEl.dataset.action;
      const cardID = targetEl.dataset.id;

      publish(this._channel, { action, cardID });
    });
  }
}

export const holdingsPublisher = new HoldingsPublisher(
  'body',
  'Holdings:btn-clicked',
);
