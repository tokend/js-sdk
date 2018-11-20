# Overview

The JavaScript SDK facilitates client integration with the `Horizon API server` and submission of  transactions. It has two main uses: [querying Horizon](#querying-horizon) and [building, signing, and submitting transactions to the System network](#building-transactions).

# Table of content
1. Basic info:
    - [Keypair](./base/keypair.md)
    - [Sign](./base/sign.md)
    - [Weights](./base/weights.md)

2. Base Classes:
    - [Call Builder](./call_builder.md)
    - [Server](./server.md)

3. Call Builders
    - [Accounts](./accounts.md)
    - [Ledgers](./ledgers.md)
    - [Operations](./operations.md)
    - [Payments](./payments.md)
    - [Reviewable Request](./reviewable_request.md)
    - [Transactions](./transactions.md)
    - [Withdrawal](./withdrawal.md)

4. [Examples](./examples/README.md)
    - [Creating a payment Transaction](./examples/README.md#creating-a-payment-transaction)
    - [Loading a payment](./examples/README.md#loading-a-payments)
    - [Loading an account's transaction history](./examples/README.md#loading-an-accounts-transaction-history)
    - [Streaming payment events](./examples/README.md#streaming-payment-events)


# Querying Horizon
js-sdk gives you access to all the endpoints exposed by Horizon.

## Building requests
js-sdk uses the [Builder pattern](https://en.wikipedia.org/wiki/Builder_pattern) to create the requests to send
to Horizon. Starting with a [server](./api/server.md) object, you can chain methods together to generate a query.

```js
var JsSdk = require('js-sdk');
var server = new JsSdk.Server('https://api.tokend.io');
// get a list of transactions that occurred in ledger 1400
server.transactions()
    .forLedger(1400)
    .call().then(function(r){ console.log(r); });

// get a list of transactions submitted by a particular account
server.transactions()
    .forAccount('GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW')
    .call().then(function(r){ console.log(r); });
```

Once the request is built, it can be invoked with `.call()`, `.callWithSignature(kp)` or with `.stream()`. `call()` and `.callWithSignature(kp)` will return a
[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to the response given by Horizon.

## Streaming requests
Many requests can be invoked with `stream()`. Instead of returning a promise like `call()` does, `.stream()` will return an `EventSource`.
Horizon will start sending responses from either the beginning of time or from the point specified with `.cursor()`.

For example, to log instances of transactions from a particular account:

```javascript
var JsSdk = require('js-sdk')
var server = new JsSdk.Server('http://api.tokend.io');
var lastCursor=0; // or load where you left off

var txHandler = function (txResponse) {
    console.log(txResponse);
};

var es = server.transactions()
    .forAccount(accountAddress)
    .cursor(lastCursor)
    .stream({
        onmessage: txHandler
    })
```

## Handling responses
### XDR
The transaction endpoints will return some fields in raw `XDR`
form. You can convert this XDR to JSON using the `.fromXDR()` method.

An example of re-writing the txHandler from above to print the XDR fields as JSON:

```javascript
var txHandler = function (txResponse) {
    console.log( JSON.stringify(JsSdk.xdr.TransactionEnvelope.fromXDR(txResponse.envelope_xdr, 'base64')) );
    console.log( JSON.stringify(JsSdk.xdr.TransactionResult.fromXDR(txResponse.result_xdr, 'base64')) );
    console.log( JSON.stringify(JsSdk.xdr.TransactionMeta.fromXDR(txResponse.result_meta_xdr, 'base64')) );
};

```


### Following links
The links returned with the Horizon response are converted into functions you can call on the returned object.
This allows you to simply use `.next()` to page through results. It also makes fetching additional info, as in the following example, easy:

```js
server.payments()
    .limit(1)
    .call()
    .then(function(response){
        // will follow the transactions link returned by Horizon
        response.records[0].transaction().then(function(txs){
            console.log(txs);
        });
    });
```
