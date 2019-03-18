/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

jest.mock('ui/metadata', () => ({
  metadata: {
    branch: 'my-metadata-branch',
    version: 'my-metadata-version',
  },
}));

import { EuiLoadingChart } from '@elastic/eui';
import { HelloWorldEmbeddable } from 'plugins/embeddable_api/__test__/embeddables/hello_world_embeddable';
import { HelloWorldEmbeddableFactory } from 'plugins/embeddable_api/__test__/index';
import { embeddableFactories } from 'plugins/embeddable_api/index';
import { QueryLanguageType, ViewMode } from 'plugins/embeddable_api/types';
import React from 'react';
import { mountWithIntl, shallowWithIntl } from 'test_utils/enzyme_helpers';
import {
  DashboardContainer,
  DashboardContainerInput,
} from '../dashboard_container';
import { DashboardPanel } from './dashboard_panel';

function getDashboardContainerInput(): DashboardContainerInput {
  return {
    viewMode: ViewMode.EDIT,
    filters: [],
    query: {
      language: QueryLanguageType.KUERY,
      query: '',
    },
    timeRange: {
      to: 'now',
      from: 'now-15m',
    },
    useMargins: false,
    title: 'My Test Dashboard',
    isFullScreenMode: false,
    panels: {},
  };
}

test('DashboardPanel renders an embeddable when it is done loading', () => {
  const container = new DashboardContainer(getDashboardContainerInput(), embeddableFactories);
  const newEmbeddable = new HelloWorldEmbeddable();
  container.addExistingEmbeddable(newEmbeddable);

  expect(newEmbeddable.id).toBeDefined();

  const component = mountWithIntl(
    <DashboardPanel.WrappedComponent
      intl={null as any}
      container={container}
      embeddableId={newEmbeddable.id}
    />
  );

  expect(component).toMatchSnapshot();

  const loadingIndicator = component.find(EuiLoadingChart);
  expect(loadingIndicator).toHaveLength(0);
});

