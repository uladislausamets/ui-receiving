import {
  interactor,
  isPresent,
  clickable,
  collection,
} from '@bigtest/interactor';

import { ButtonInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

import { TITLE_ACCORDION } from '../../../src/TitleDetails/constants';

@interactor class ExpectedPiecesAccordion {
  static defaultScope = `#${TITLE_ACCORDION.expected}`;
  clickAddPiece = clickable('[data-test-add-piece-button]');
  pieces = collection('[class*=mclRow---]', {
    actions: new ButtonInteractor('#expected-piece-action-menu'),
  });
  editButton = new ButtonInteractor('[data-test-button-edit-piece]');
  receiveButton = new ButtonInteractor('[data-test-button-receive-piece]');
}

@interactor class ReceivedPiecesAccordion {
  static defaultScope = `#${TITLE_ACCORDION.received}`;
  pieces = collection('[class*=mclRow---]', {
    actions: new ButtonInteractor('#received-piece-action-menu'),
  });
  unreceiveButton = new ButtonInteractor('[data-test-button-unreceive-piece]');
}

export default @interactor class TitleDetailsInteractor {
  static defaultScope = '#pane-title-details';

  expectedPiecesAccordion = new ExpectedPiecesAccordion();
  receivedPiecesAccordion = new ReceivedPiecesAccordion();

  isLoaded = isPresent('[class*=paneTitleLabel---]');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
}
