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

import { Embeddable, triggerRegistry } from 'plugins/embeddable_api/index';
import React from 'react';
import ReactDom from 'react-dom';
import { kfetch } from 'ui/kfetch';
import { UserCard } from './user_card';
import {
  USER_EMBEDDABLE,
  UserEmbeddableInput,
  UserEmbeddableOutput,
} from './user_embeddable_factory';

export const VIEW_USER_TRIGGER = 'VIEW_USER_TRIGGER';
export const EMAIL_USER_TRIGGER = 'EMAIL_USER_TRIGGER';

export class UserEmbeddable extends Embeddable<UserEmbeddableInput, UserEmbeddableOutput> {
  private unsubscribe: () => void;
  constructor(initialInput: UserEmbeddableInput) {
    super(USER_EMBEDDABLE, initialInput, {});
    this.unsubscribe = this.subscribeToInputChanges(() => this.initializeOutput());
    this.initializeOutput();
  }

  public destroy() {
    this.unsubscribe();
  }

  public render(node: HTMLElement) {
    ReactDom.render(<UserCard key={this.id} embeddable={this} />, node);
  }

  private async initializeOutput() {
    //  const usersUrl = chrome.addBasePath('/api/security/v1/users');
    try {
      const usersUrl = '/api/security/v1/users';
      const url = `${usersUrl}/${this.input.username}`;
      const { data } = await kfetch({ pathname: url });
      this.emitOutputChanged({
        user: {
          ...data,
        },
      });
    } catch (e) {
      this.output.error = e;
    }
  }
}

triggerRegistry.registerTrigger({
  id: VIEW_USER_TRIGGER,
  title: 'View user',
});

triggerRegistry.registerTrigger({
  id: EMAIL_USER_TRIGGER,
  title: 'Email user',
});

// triggerRegistry.addDefaultAction({ triggerId: VIEW_EMPLOYEE_TRIGGER, actionId:  })
