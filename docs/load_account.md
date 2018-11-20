# loadAccountWithSign()

## Overview

`loadAccountWithSign()` allows you to get account data from the network.  Simply pass in the address of the account you're interested in, and it will return to you a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves to an `Account object`

## Parameters

| Parameter | Type     | Description                          |
| --------- | -------- | ------------------------------------ |
| `address` | `string` | Address of account you want to load. |

## Example

``` js
server.loadAccountWithSign("GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ", accountKP)
    .then(function (account) {
        // build the transaction with the account as the source
        var transaction = new JsSdk.TransactionBuilder(account)
            .addOperation(JsSdk.Operation.payment(paymentParamsObject))
            .build();

        transaction.sign(JsSdk.Keypair.fromSeed(seedString)); // sign the transaction

        return server.submitTransaction(transaction);
    })
    .then(function (transactionResult) {
        console.log(transactionResult);
    })
    .catch(function (err) {
        console.error(err);
    });
```
