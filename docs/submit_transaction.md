# submitTransaction()


## Overview

You can build a transaction locally (see [this example](../readme.md#building-transactions)), but after you build it you have to submit it to the Horizon server.  js-sdk has a function `submitTransaction()` that sends your transaction to the Horizon server (via the `transactions_create` endpoint).

## Methods

| Method                           | Param Type                               | Description                           |
| -------------------------------- | ---------------------------------------- | ------------------------------------- |
| `submitTransaction(Transaction)` | `Transaction` | Submits a transaction to the network. |

## Example

```js
var JsSdk = require('js-sdk')
var server = new JsSdk.Server('https://api.tokend.io');

var transaction = new JsSdk.TransactionBuilder(account)
        // this operation funds the new account with XLM
        .addOperation(JsSdk.Operation.payment(paymentParamsObject))
        .build();

transaction.sign(JsSdk.Keypair.fromSeed(seedString)); // sign the transaction

server.submitTransaction(transaction)
    .then(function (transactionResult) {
        console.log(transactionResult);
    })
    .catch(function (err) {
        console.error(err);
    });
```
