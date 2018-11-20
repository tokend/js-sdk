# Fees

## Overview

In order to read information about payments from a Horizon server, the [`server`](./server.md) object provides the `fees()` function. 
`fees()` returns an `UserCallBuilder` class, an extension of the [`CallBuilder`](./call_builder.md) class.

By default, `fees()` provides access to the `fees_all` Horizon endpoint.  By chaining other methods to it, you can reach other operation endpoints.

## Methods

| Method                                   | Param Type | Description                              |
| ---------------------------------------- | ---------- | ---------------------------------------- |
| `fees()`                                 |            | Load all fees for all assets.            |
| `.fee(feeType,asset, accountId, amount)` |            | Load fee for particular feeType and asset. |

- `.fee(feeType,asset, accountId, amount)` :

| Parameter   | Type     | Description                          |
| ----------- | -------- | ------------------------------------ |
| `feeType`   | `number` | Type of fee from XDR Enum.           |
| `asset`     | `string` | Filter fee by passed asset.          |
| `accountId` | `string` | Filter fee by passed user accountId. |
| `amount`    | `string` | Filter fee by passed amount.         |
