import {CallBuilder} from "./call_builder";

export class NotificationsCallBuilder extends CallBuilder {
  constructor(serverUrl) {
    super(serverUrl);
    this.url.segment('notifications');
  }

  accountId(id) {
    this.filter.push(['notifications', id]);
    return this;
  }
}
