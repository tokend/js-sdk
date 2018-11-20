---
title: transactions()
---

## Overview

In order to read information about transactions from a Horizon server, the [`server`](./server.md) object provides the `transactions()` function. `transactions()` returns an `TransactionCallBuilder` class, an extension of the [`CallBuilder`](./call_builder.md) class.

By default, `transactions()` provides access to the `transactions_all` Horizon endpoint.  By chaining other methods to it, you can reach other transaction endpoints.

## Methods

| Method                                   | Param Type                               | Description                              |
| ---------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| `transactions()`                         | Access all transactions.                 |                                          |
| `.transaction(transactionHash)` `string` | Pass in the hash of the transaction you're interested in to access its details. |                                          |
| `.forAccount(address)`                   | `string`                                 | Pass in the address of a particular account to access its transactions. |
| `.forLedger(ledgerSeq)`                  | `string`                                 | Pass in the ledger sequence of a particular ledger to access its transactions. |
| `.limit(limit)`                          | `integer`                                | Limits the number of returned resources to the given `limit`. |
| `.cursor("token")`                       | `string`                                 | Return only resources after the given paging token. |
| `.order({"asc" or "desc"})`              | `string`                                 | Order the returned collection in "asc" or "desc" order. |
| `.call()`                                |                                          | Triggers a HTTP Request to the Horizon server based on the builder's current configuration.  Returns a `Promise` that resolves to the server's response.  For more on `Promise`, see [these docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). |
| `.stream({options})`                     | object of [properties](https://developer.mozilla.org/en-US/docs/Web/API/EventSource#Properties) | Creates an `EventSource` that listens for incoming messages from the server.  URL based on builder's current configuration.  For more on `EventSource`, see [these docs](https://developer.mozilla.org/en-US/docs/Web/API/EventSource). |
