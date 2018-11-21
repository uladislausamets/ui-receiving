import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SearchAndSort from '@folio/stripes-smart-components/lib/SearchAndSort';
import { filters2cql } from '@folio/stripes-components/lib/FilterGroups';
import packageInfo from '../../package';
// import Panes from '../components/Panes';
// import { POForm } from '../components/PO';
import { Filters, SearchableIndexes } from '../Utils/FilterConfig';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const filterConfig = Filters();
const searchableIndexes = SearchableIndexes;

class Main extends Component {
  static propTypes = {
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    stripes: PropTypes.object
  }

  static manifest = Object.freeze({
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'Name'
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      clear: true,
      records: 'vendors',
      recordsRequired: '%{resultCount}',
      path: 'vendor',
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: (...args) => {
            /*
              This code is not DRY as it is copied from makeQueryFunction in stripes-components.
              This is necessary, as makeQueryFunction only referneces query paramaters as a data source.
              STRIPES-480 is intended to correct this and allow this query function to be replace with a call
              to makeQueryFunction.
              https://issues.folio.org/browse/STRIPES-480
            */
            const resourceData = args[2];
            const sortMap = {
              id: 'id',
              po_number: 'po_number',
              created: 'created',
              comments: 'comments',
              assigned_to: 'assigned_to',
            };

            const index = resourceData.query.qindex ? resourceData.query.qindex : 'all';
            const searchableIndex = searchableIndexes.find(idx => idx.value === index);

            let cql = searchableIndex.makeQuery(resourceData.query.query);
            const filterCql = filters2cql(filterConfig, resourceData.query.filters);
            if (filterCql) {
              if (cql) {
                cql = `(${cql}) and ${filterCql}`;
              } else {
                cql = filterCql;
              }
            }

            const { sort } = resourceData.query;
            if (sort) {
              const sortIndexes = sort.split(',').map((sort1) => {
                let reverse = false;
                if (sort1.startsWith('-')) {
                  // eslint-disable-next-line no-param-reassign
                  sort1 = sort1.substr(1);
                  reverse = true;
                }
                let sortIndex = sortMap[sort1] || sort1;
                if (reverse) {
                  sortIndex = `${sortIndex.replace(' ', '/sort.descending ')}/sort.descending`;
                }
                return sortIndex;
              });

              cql += ` sortby ${sortIndexes.join(' ')}`;
            }
            return cql;
          },
        },
        staticFallback: { params: {} },
      },
    },
    // Vendor
    vendorQuery: { initialValue: { query: '' } },
    vendorResultCount: { initialValue: INITIAL_RESULT_COUNT },
    vendor: {
      type: 'okapi',
      clear: true,
      records: 'vendors',
      recordsRequired: '%{vendorResultCount}',
      path: 'vendor',
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: (...args) => {
            const resourceData = args[2];
            const cql = `(name="${resourceData.poLineQuery.query}*")`;
            return cql;
          },
        },
        staticFallback: { params: {} },
      },
    },
    // Po Line
    poLineQuery: { initialValue: { query: '' } },
    poLineResultCount: { initialValue: INITIAL_RESULT_COUNT },
    poLine: {
      type: 'okapi',
      clear: true,
      records: 'po_lines',
      recordsRequired: '%{poLineResultCount}',
      path: 'po_line',
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: (...args) => {
            const resourceData = args[2];
            const cql = `(id="${resourceData.poLineQuery.query}*")`;
            return cql;
          },
        },
        staticFallback: { params: {} },
      },
    }
  });

  create = (data) => {
    const { mutator } = this.props;
    mutator.records.POST(data).then(newOrder => {
      mutator.query.update({
        _path: `/vendor/view/${newOrder.id}`,
        layer: null
      });
    });
  }

  render() {
    const { stripes, resources, mutator } = this.props;
    const resultsFormatter = {
      'id': data => _.toString(_.get(data, ['id'], '')),
      'po_number': data => _.toString(_.get(data, ['po_number'], '')),
      'created': data => _.toString(_.get(data, ['created'], '')),
      'comments': data => _.toString(_.get(data, ['comments'], '')),
      'assigned_to': data => _.toString(_.get(data, ['assigned_to'], '')),
    };
    const getRecords = (resources || {}).records || [];
    return (
      <div>
        {
          getRecords &&
          <SearchAndSort
            packageInfo={packageInfo}
            objectName="Receiving"
            baseRoute={packageInfo.stripes.route}
            filterConfig={filterConfig}
            visibleColumns={['id', 'po_number', 'created', 'comments', 'assigned_to']}
            resultsFormatter={resultsFormatter}
            // viewRecordComponent={Panes}
            // editRecordComponent={POForm}
            onCreate={this.create}
            newRecordInitialValues={{}}
            initialResultCount={INITIAL_RESULT_COUNT}
            resultCountIncrement={RESULT_COUNT_INCREMENT}
            finishedResourceName="perms"
            viewRecordPerms="vendor.item.get"
            newRecordPerms="vendor.item.post, login.item.post"
            parentResources={resources}
            parentMutator={mutator}
            detailProps={stripes}
            stripes={stripes}
          />
        }
      </div>
    );
  }
}

export default Main;
