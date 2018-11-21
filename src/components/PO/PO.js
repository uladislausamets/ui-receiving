import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Icon, IconButton, AccordionSet, Accordion, ExpandAllButton, Pane, PaneMenu, Row, Col, Button, IfPermission } from '@folio/stripes-components';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import FundDistribution from '../FundDistribution';
import LineListing from '../LineListing';
import { PODetailsView } from '../PODetails';
import { SummaryView } from '../Summary';
import LayerCollection from '../LayerCollection';

class PO extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    dropdown: PropTypes.object,
    stripes: PropTypes.object.isRequired,
    onCloseEdit: PropTypes.func,
    onClose: PropTypes.func,
    onEdit: PropTypes.func,
    parentResources: PropTypes.object.isRequired,
    parentMutator: PropTypes.object.isRequired,
    editLink: PropTypes.string,
    paneWidth: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      sections: {
        purchaseOrder: true,
        POSummary: true,
        POListing: true
      }
    };
    this.handleExpandAll = this.handleExpandAll.bind(this);
    this.onToggleSection = this.onToggleSection.bind(this);
    this.onAddPOLine = this.onAddPOLine.bind(this);
    this.transitionToParams = transitionToParams.bind(this);
  }

  getData() {
    const { parentResources, match: { params: { id } } } = this.props;
    const po = (parentResources.records || {}).records || [];
    if (!po || po.length === 0 || !id) return null;
    return po.find(u => u.id === id);
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

  onAddPOLine = (e) => {
    if (e) e.preventDefault();
    this.transitionToParams({ layer: 'create-po-line' });
  }

  render() {
    const { location } = this.props;
    const initialValues = this.getData();
    const lastMenu = (
      <PaneMenu>
        <IfPermission perm="vendor.item.put">
          <IconButton
            icon="edit"
            id="clickable-editvendor"
            style={{ visibility: !initialValues ? 'hidden' : 'visible' }}
            onClick={this.props.onEdit}
            href={this.props.editLink}
            title="Edit Vendor"
          />
        </IfPermission>
      </PaneMenu>
    );
    const addPOLineButton = (<Button onClick={this.onAddPOLine}>Add PO Line</Button>);

    if (!initialValues) {
      return (
        <Pane id="pane-podetails" defaultWidth="fill" paneTitle="Details" lastMenu={lastMenu} dismissible onClose={this.props.onClose}>
          <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>
        </Pane>
      );
    }

    return (
      <Pane id="pane-podetails" defaultWidth="fill" paneTitle={_.get(initialValues, ['name'], '')} lastMenu={lastMenu} dismissible onClose={this.props.onClose}>
        <FundDistribution openReceiveItem={this.openReceiveItem} />
        <Row end="xs"><Col xs><ExpandAllButton accordionStatus={this.state.sections} onToggle={this.handleExpandAll} /></Col></Row>
        <AccordionSet accordionStatus={this.state.sections} onToggle={this.onToggleSection}>
          <Accordion label="Purchase Order" id="purchaseOrder">
            <PODetailsView initialValues={initialValues} {...this.props} />
          </Accordion>
          <Accordion label="PO Summary" id="POSummary">
            <SummaryView initialValues={initialValues} {...this.props} />
          </Accordion>
          <Accordion label="PO Listing" id="POListing" displayWhenOpen={addPOLineButton}>
            <LineListing initialValues={initialValues} {...this.props} />
          </Accordion>
        </AccordionSet>
        <LayerCollection
          location={location}
          initialValues={initialValues}
          stripes={this.props.stripes}
          onCancel={this.props.onCloseEdit}
          parentResources={this.props.parentResources}
          parentMutator={this.props.parentMutator}
        />
      </Pane>
    );
  }
}

export default PO;
