import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

import { ButtonInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

export default @interactor class ReceivingFormInteractor {
  static defaultScope = '#receiving-modal';

  receiveButton = new ButtonInteractor('[data-test-receive-piece]');

  isLoaded = isPresent('[class*=modal---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
}
