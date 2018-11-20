# Withdrawals

## Overview

In order to read information about payments from a Horizon server, the [`server`](./server.md) object provides the `withdrawals()` function. 
`withdrawals()` returns an `WithdrawalCallBuilder` class, an extension of the [`CallBuilder`](./call_builder.md) class.

By default, `withdrawals()` provides access to the `reviewable_requests_all` Horizon endpoint.  By chaining other methods to it, you can reach other operation endpoints.

## Methods

| Method                              | Param Type | Description                              |
| ----------------------------------- | ---------- | ---------------------------------------- |
| `withdrawals()`              |            | Access all reviewable Requests.          |
| `.forDestAsset(asset)`                  | `string`   | Filters withdrawals by destination asset. For example: "BTC"  |
| `.forRequester(requestor)`          | `string`   | Filters withdrawals by requester. For example: "GDRYPV..."  |
| `.forState(state)`          | `number`   | Filters withdrawals by state. |
