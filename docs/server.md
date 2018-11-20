# Server

## Overview

The `server` object handles a network connection to the `Horizon` server.  It provides methods that makes requests to that Horizon server easy.

It is important to note that `server` methods query to `Horizon` endpoints.  Each method points to a particular set of endpoints -- for example, `accounts()` queries `accounts_all` or `accounts_single`.  In order to specify exactly which of the two, more methods are provided after calling `accounts()`.  For more, please see the documentation for [`CallBuilder`][1] and for each of the methods belonging to `server`.

## Parameters

| Parameter         | Type      | Required | Description                              |
| ----------------- | --------- | -------- | ---------------------------------------- |
| `config`          | `object`  | No       | The server configuration                 |
| `config.secure`   | `boolean` | No       | If `true`, establishes a connection with HTTPS instead of HTTP.  Defaults `false`. |
| `config.hostname` | `string`  | No       | The hostname of the Horizon server.  Defaults to `localhost`. |
| `config.port`     | `integer` | No       | The port of the Horizon server to connect to.  Defaults to 3000. |

## Methods

| Method                                 | Params        | Description                              |
| -------------------------------------- | ------------- | ---------------------------------------- |
| [`accounts()`][2]                      | None          | Returns an `AccountCallBuilder` with methods to query account endpoints. |
| [`fees()`][3]                          | None          | Returns a `FeesCallBuilder` with methods to query fees endpoints. |
| [`ledgers()`][5]                       | None          | Returns a `LedgerCallBuilder` with methods to query ledger endpoints. |
| [`transactions()`][6]                  | None          | Returns a `TransactionCallBuilder` with methods to query transaction endpoints. |
| [`operations()`][7]                    | None          | Returns an `OperationsCallBuilder` with methods to query operation endpoints. |
| [`payments()`][8]                      | None          | Returns a `PaymentCallBuilder` with methods to query payment endpoints. |
| [`reviewableRequests()`][10]           | None          | Returns a `ReviewableRequestsCallBuilder` with methods to query reviewable requests endpoints. |
| [`users()`][12]                        | None          | Returns an`UsersCallBuilder` with methods to query users endpoints. |
| [`withdrawals()`][13]                  | None          | Returns an`WithdrawalsCallBuilder` with methods to query withdrawals endpoints. |
| [`loadAccount(accountId)`][14]         | `string`      | Load an `Account` details by passed accountID. |
| [`submitTransaction(transaction)`][15] | `Transaction` | Submits a transaction to the network.    |

[1]: ./call_builder.md
[2]: ./callbuilders/accounts.md
[3]: ./callbuilders/fees.md
[5]: ./callbuilders/ledgers.md
[6]: ./callbuilders/transactions.md
[7]: ./callbuilders/operations.md
[8]: ./callbuilders/payments.md
[10]: ./callbuilders/reviewable_request.md
[12]: ./callbuilders/users.md
[13]: ./callbuilders/withdrawals.md
[14]: ./load_account.md
[15]: ./submit_transaction.md
