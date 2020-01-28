import {
  interactor,
  is,
  isPresent,
  value,
} from '@bigtest/interactor';

import { ButtonInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

@interactor class CaptionInput {
  static defaultScope = '[name="caption"]';
  isInput = is('input');
  value = value();
}

export default @interactor class PieceFormInteractor {
  static defaultScope = '#add-piece-modal';

  caption = new CaptionInput();
  cancelButton = new ButtonInteractor('[data-test-add-piece-cancel]');
  saveButton = new ButtonInteractor('[data-test-add-piece-save]');
  receiveButton = new ButtonInteractor('[data-test-add-piece-check-in]');
  addItemButton = new ButtonInteractor('[data-test-add-item]');

  isLoaded = isPresent('[class*=modal---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
}
