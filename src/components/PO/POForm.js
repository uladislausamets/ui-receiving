import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import stripesForm from '@folio/stripes-form';
import { Pane, PaneMenu, Button, Row, Icon, Col, IfPermission, AccordionSet, Accordion, ExpandAllButton } from '@folio/stripes-components';
import { PODetailsForm } from '../PODetails';
import { SummaryForm } from '../Summary';

class POForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onRemove: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    parentResources: PropTypes.object,
    parentMutator: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      sections: {
        purchaseOrder: true,
        POSummary: true,
      }
    };
    this.deletePO = this.deletePO.bind(this);
    this.handleExpandAll = this.handleExpandAll.bind(this);
    this.onToggleSection = this.onToggleSection.bind(this);
  }

  getAddFirstMenu() {
    const { onCancel } = this.props;
    return (
      <PaneMenu>
        <button type="button" id="clickable-close-new-purchase-order-dialog" onClick={onCancel} title="close" aria-label="Close New Purchase Order Dialog">
          <span style={{ fontSize: '30px', color: '#999', lineHeight: '18px' }}>&times;</span>
        </button>
      </PaneMenu>
    );
  }

  getLastMenu(id, label) {
    const { pristine, submitting, handleSubmit } = this.props;
    return (
      <PaneMenu>
        <Button
          id={id}
          type="submit"
          title={label}
          disabled={pristine || submitting}
          onClick={handleSubmit}
          style={{ marginBottom: '0' }}
        >
          {label}
        </Button>
      </PaneMenu>
    );
  }

  onToggleSection({ id }) {
    this.setState((curState) => {
      const newState = _.cloneDeep(curState);
      newState.sections[id] = !curState.sections[id];
      return newState;
    });
  }

  handleExpandAll(obj) {
    this.setState((curState) => {
      const newState = _.cloneDeep(curState);
      newState.sections = obj;
      return newState;
    });
  }

  deletePO(ID) {
    const { parentMutator } = this.props;
    parentMutator.records.DELETE({ id: ID }).then(() => {
      parentMutator.query.update({
        _path: '/receiving',
        layer: null
      });
    });
  }

  render() {
    const { initialValues, onCancel } = this.props;
    const firstMenu = this.getAddFirstMenu();
    const paneTitle = initialValues.id ? (
      <span>
        {`Edit: ${_.get(initialValues, ['id'], '')}`}
      </span>
    ) : 'Create Order';
    const lastMenu = initialValues.id ?
      this.getLastMenu('clickable-update-purchase-order', 'Update Order') :
      this.getLastMenu('clickable-create-new-purchase-order', 'Create Order');
    const showDeleteButton = initialValues.id || false;

    if (!initialValues) {
      return (
        <Pane id="pane-podetails" defaultWidth="fill" paneTitle="Details" fistMenu={firstMenu} onClose={onCancel} lastMenu={lastMenu} dismissible>
          <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>
        </Pane>
      );
    }

    return (
      <Pane id="pane-poForm" defaultWidth="fill" paneTitle={paneTitle} fistMenu={firstMenu} onClose={onCancel} lastMenu={lastMenu} dismissible>
        <form id="form-po">
          <Row>
            <Col xs={12}>
              <Row center="xs">
                <Col xs={12} md={8}>
                  <Row end="xs">
                    <Col xs={12}>
                      <ExpandAllButton accordionStatus={this.state.sections} onToggle={this.handleExpandAll} />
                    </Col>
                  </Row>
                </Col>
                <Col xs={12} md={8} style={{ textAlign: 'left' }}>
                  <AccordionSet accordionStatus={this.state.sections} onToggle={this.onToggleSection}>
                    <Accordion label="Purchase Order" id="purchaseOrder">
                      <PODetailsForm {...this.props} />
                    </Accordion>
                    <Accordion label="PO Summary" id="POSummary">
                      <SummaryForm {...this.props} />
                    </Accordion>
                  </AccordionSet>
                  <IfPermission perm="vendor.item.delete">
                    <Row end="xs">
                      <Col xs={12}>
                        {
                          showDeleteButton &&
                          <Button type="button" buttonStyle="danger" onClick={() => { this.deletePO(this.props.initialValues.id); }}>Remove</Button>
                        }
                      </Col>
                    </Row>
                  </IfPermission>
                </Col>
              </Row>
            </Col>
          </Row>
        </form>
      </Pane>
    );
  }
}

export default stripesForm({
  form: 'FormPO',
  navigationCheck: true,
  enableReinitialize: true,
})(POForm);
