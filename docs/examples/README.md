# Examples

- [Creating a payment Transaction](#creating-a-payment-transaction)
- [Loading a payment](#loading-a-payments)
- [Loading an account's transaction history](#loading-an-accounts-transaction-history)
- [Streaming payment events](#streaming-payment-events)

## Creating a payment transaction

User can make a payment from its balance.

To obtain payment fee:

```javascript
var feeData = {
    sourceFee: {
        fixedFee: '',
        paymentFee: '',
    },
    destinationFee: {
        fixedFee: '',
        paymentFee: '',
    },
    sourcePaysForDest: false // or true - pay fee instead recipient
}
function getFee(asset, accountId, amount) {
    return server.fees().fee(JsSdk.xdr.FeeType.paymentFee().value, asset, accountId, amount).call()
}

getFee(asset, exchangeKp.accountId(), amount)
    .then(function(fee) {
        feeData.sourceFee.fixedFee = fee.fixed;
        feeData.sourceFee.paymentFee = fee.percent;

        return getFee(asset, userAccountId, amount)
    }).then(function(fee) {
        feeData.destinationFee.fixedFee = fee.fixed;
        feeData.destinationFee.paymentFee = fee.percent;
    })
```

To submit payment:

```javascript
let opts = {
  sourceBalanceId,
  destinationBalanceId,
  amount,
  asset,
  subject,
  feeData
};
let op = JsSdk.Operation.payment(opts);
server.submitOperation(op, sourceID, signerKP);
```

| Name | Type | Meaning |
| ------ | ------ | ------ |
| sourceBalanceId | string | Your balanceID to spend money from |
| destinationBalanceId | string | BalanceID of the receiver |
| amount | string | |
| asset | string | Asset code ('SUN', etc)|
| subject | string | Some related message |
| feeData | object | Object containing fee for sender and recipient received from Api |

### Full example 

```js
//  Example of payment submission:
var JsSdk = require("tokend-js-sdk");
JsSdk.Network.use(new JsSdk.Network("SUN Staging Network ; December 2017"));
var server = new JsSdk.Server('http://api.tokend.io', { allowHttp: true });

function getBalanceIdForAsset(asset, exchangeKp) {
    return server.loadAccountWithSign(exchangeKp.accountId(), exchangeKp)
        .then(function (accountInfo) {
            for (var i in accountInfo.balances) {
                if (accountInfo.balances[i].asset === asset) {
                    return accountInfo.balances[i].balance_id;
                }
            }
            throw Error("BalanceId for asset " + asset + " is not present");
        })
}

function getUserBalanceId(asset, userAccountId, exchangeKp) {
    return server.balances()
        .forAccount(userAccountId)
        .callWithSignature(exchangeKp)
        .then(function(response) {
            var balances = response.records;

            for (var i in balances) {
                if (balances[i].asset === asset) {
                    return balances[i].balance_id;
                }
            }

            throw Error("BalanceId for asset " + asset + " is not present");
        })
}

function getFee(asset, accountId, amount) {
    return server.fees().fee(JsSdk.xdr.FeeType.paymentFee().value, asset, accountId, amount).call()
}

var exchangeKp = JsSdk.Keypair.fromSecret("SBRX2VZ....")
var userAccountId = "GBKJATAX...."
var sourceBalanceId, destinationBalanceId
var amount = "100.5005"
var asset = "SUN"
var subject = "Some info of this transfer"
var payFeeInsteadRecipient = false // true or false

var feeData = {
    sourceFee: {
        fixedFee: '',
        paymentFee: '',
    },
    destinationFee: {
        fixedFee: '',
        paymentFee: '',
    },
    sourcePaysForDest: payFeeInsteadRecipient
}

getBalanceIdForAsset(asset, exchangeKp)
    .then(function (balanceId){
        sourceBalanceId = balanceId;
        return getUserBalanceId(asset, userAccountId, exchangeKp);
    }).then(function (balanceId){
        destinationBalanceId = balanceId;

        return getFee(asset, exchangeKp.accountId(), amount)
    }).then(function(fee) {
        feeData.sourceFee.fixedFee = fee.fixed;
        feeData.sourceFee.paymentFee = fee.percent;

        return getFee(asset, userAccountId, amount)
    }).then(function(fee) {
        feeData.destinationFee.fixedFee = fee.fixed;
        feeData.destinationFee.paymentFee = fee.percent;

        var opts = {
            sourceBalanceId,
            destinationBalanceId,
            amount,
            asset,
            subject,
            feeData,
        };

        var op = JsSdk.Operation.payment(opts);
        return server.submitOperation(op, exchangeKp.accountId(), exchangeKp);
    }).then(function (result){
        console.log("Payment sent")
        console.log("Server response:", result)
    }).catch(function (err) {
        console.log("Payment failed!")
        console.log("Error:", err)
    })
```

## Loading a payments

```javascript
this.server.payments()
  .forAccount(accountKP.accountId())
  .callWithSignature(accountKP)
  .then(function (response) {
    ...
  })
  .catch(function (err) {
    ...
  })
```

Available extensions:
|Method | Params | Description |
| -- | -- | -- |
| `.order('asc' or 'desc')`| `string` | Sorting direction |
|`.limit(5)` | `number` | Records per page |
|`.page(2)` | `number` | Load page with specific number |
|`.next()`, `.prev()`| | Load next or previous page |



Response example:

```javascript
 {
    "_links": {
      "self": {
        "href": "http://api.tokend.io/operations/384829069725697"
      },
      "transaction": {
        "href": "http://api.tokend.io/transactions/"
      },
      "succeeds": {
        "href": "http://api.tokend.io/effects?order=desc\u0026cursor=384829069725697"
      },
      "precedes": {
        "href": "http://api.tokend.io/effects?order=asc\u0026cursor=384829069725697"
      }
    },
    "id": "384829069725697",
    "paging_token": "384829069725697",
    "source_account": "GAD5HWKFB2VZGIGVVQ54R5NZRL36PVNISS72A3NFMVT5X3XYKNGDPMD7",
    "type": "payment",
    "type_i": 1,
    "state": 2,
    "identifier": "35",
    "ledger_close_time": "2017-05-09T15:22:18Z",
    "participants": [
      {
        "account_id": "GAD5HWKFB2VZGIGVVQ54R5NZRL36PVNISS72A3NFMVT5X3XYKNGDPMD7",
        "balance_id": "BAD5HWKFB2VZGIGVVQ54R5NZRL36PVNISS72A3NFMVT5X3XYKNGDPDFU"
      },
      {
        "account_id": "GAHKZT6X4WIEDEET2P5PHOL4OEE24KMHTJ2IWZUWUR22YROGKUXKLIET",
        "balance_id": "BAHKZT6X4WIEDEET2P5PHOL4OEE24KMHTJ2IWZUWUR22YROGKUXKLHCY"
      }
    ],
    "from": "GAD5HWKFB2VZGIGVVQ54R5NZRL36PVNISS72A3NFMVT5X3XYKNGDPMD7",
    "to": "GAHKZT6X4WIEDEET2P5PHOL4OEE24KMHTJ2IWZUWUR22YROGKUXKLIET",
    "from_balance": "BAD5HWKFB2VZGIGVVQ54R5NZRL36PVNISS72A3NFMVT5X3XYKNGDPDFU",
    "to_balance": "BAHKZT6X4WIEDEET2P5PHOL4OEE24KMHTJ2IWZUWUR22YROGKUXKLHCY",
    "amount": "0.1000",
    "payment_fee": "0.0000",
    "fee_from_source": true,
    "fixed_fee": "0.0010",
    "subject": "",
    "reference": "ref"
  }

```

## Loading an account's transaction history

Let's say you want to look at an account's transaction history.  You can use the `transactions()` command and pass in the account address to `forAccount` as the resource you're interested in.

```javascript
var JsSdk = require('js-sdk')
var server = new JsSdk.Server('https://api.tokend.io');
var accountId = 'GBBORXCY3PQRRDLJ7G7DWHQBXPCJVFGJ4RGMJQVAX6ORAUH6RWSPP6FM';

server.transactions()
    .forAccount(accountId)
    .call()
    .then(function (page) {
        console.log('Page 1: ');
        console.log(page.records);
        return page.next();
    })
    .then(function (page) {
        console.log('Page 2: ');
        console.log(page.records);
    })
    .catch(function (err) {
        console.log(err);
    });
```

## Streaming payment events

js-sdk provides streaming support for Horizon endpoints using `EventSource`.  You can pass a function to handle any events that occur on the stream.

Try submitting a transaction (via the guide above) while running the following code example.
```javascript
var JsSdk = require('js-sdk')
var server = new JsSdk.Server('https://api.tokend.io');

// Get a message any time a payment occurs. Cursor is set to "now" to be notified
// of payments happening starting from when this script runs (as opposed to from
// the beginning of time).
var es = server.payments()
  .cursor('now')
  .stream({
    onmessage: function (message) {
      console.log(message);
    }
  })
```
