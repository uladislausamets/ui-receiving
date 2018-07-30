import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import IfPermission from '@folio/stripes-components/lib/IfPermission';
import { PO } from '../PO';
import POLine from '../POLine/POLine';

class Panes extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.connectedPO = this.props.stripes.connect(PO);
    this.connectedPOLine = this.props.stripes.connect(POLine);
  }

  render() {
    return (
      <Switch>
        <Route
          exact
          path={`${this.props.match.path}`}
          render={props => <this.connectedPO
            {...this.props}
            {...props}
          />}
        />
        <IfPermission perm="purchase_order.item.view">
          <Route
            exact
            path={`${this.props.match.path}/po-line/view/:id`}
            render={props => <this.connectedPOLine
              poURL={`${this.props.match.url}`}
              {...this.props}
              {...props}
            />}
          />
        </IfPermission>
        <Route render={props => <this.connectedPO {...this.props} {...props} />} />
      </Switch>
    );
  }
}

export default Panes;
