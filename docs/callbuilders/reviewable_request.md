# Reviewable Requests

## Overview

In order to read information about payments from a Horizon server, the [`server`](./server.md) object provides the `reviewableRequests()` function. 
`reviewableRequests()` returns an `ReviewableRequestsCallBuilder` class, an extension of the [`CallBuilder`](./call_builder.md) class.

By default, `reviewableRequests()` provides access to the `reviewable_requests_all` Horizon endpoint.  By chaining other methods to it, you can reach other operation endpoints.

## Methods

| Method                              | Param Type | Description                              |
| ----------------------------------- | ---------- | ---------------------------------------- |
| `reviewableRequests()`              |            | Access all reviewable Requests.          |
| `.reviewableRequest(id)`            | `string`   | Provides information on a single reviewable request. |
| `.forAsset(asset)`                  | `string`   | Filters reviewable requests by asset. For example: "USD"  |
| `.forReviewer(reviewer)`            | `string`   | Filters reviewable requests by reviewer. For example: "GDRYPV..."  |
| `.forRequestor(requestor)`          | `string`   | Filters reviewable requests by requestor. For example: "GDRYPV..."  |
| `.forState(state)`          | `number`   | Filters reviewable requests by state. |
| `.forType(types1, type2 ... typeN)` | `number`   | Filters reviewable requests by type. |
