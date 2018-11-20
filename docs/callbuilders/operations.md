# Operations

Operation is some action, performed in the Network.
For example, manageBalance is an operation to create balance for some user in some asset.

Each operation has:

 * threshold (defined for each type of operations for the whole , see paragraph "Weights")
 * sourceID (on behalf of whom it is performed) 
 * signerKP (see paragraph "Signers" below)

 
 Each submission of the operation will has such fields:
 
| Name | Type | Description |
| ------ | ------ | ------ |
| sourceID | string | Public Key of the Exchange account |
| signerKP | Keypair | Either the Exchange or signer's one |


To obtain list of operations:

```js
server.operations()
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
      "href": "https://api.tokend.io/accounts/GAHKZT6X4WIEDEET2P5PHOL4OEE24KMHTJ2IWZUWUR22YROGKUXKLIET/operations?order=asc\u0026limit=10\u0026cursor="
    },
    "next": {
      "href": "https://api.tokend.io/accounts/GAHKZT6X4WIEDEET2P5PHOL4OEE24KMHTJ2IWZUWUR22YROGKUXKLIET/operations?order=asc\u0026limit=10\u0026cursor=15685220569089"
    },
    "prev": {
      "href": "https://api.tokend.io/accounts/GAHKZT6X4WIEDEET2P5PHOL4OEE24KMHTJ2IWZUWUR22YROGKUXKLIET/operations?order=desc\u0026limit=10\u0026cursor=1331439865857"
    }
  },
  "_embedded": {
    "records": [
      {
        "_links": {
          "self": {
            "href": "https://api.tokend.io/operations/1331439865857"
          },
          "transaction": {
            "href": "https://api.tokend.io/transactions/"
          },
          "succeeds": {
            "href": "https://api.tokend.io/effects?order=desc\u0026cursor=1331439865857"
          },
          "precedes": {
            "href": "https://api.tokend.io/effects?order=asc\u0026cursor=1331439865857"
          }
        },
        "id": "1331439865857",
        "paging_token": "1331439865857",
        "source_account": "GDRYPVZ63SR7V2G46GKRGABJD3XPDNWQ4B4PQPJBTTDUEAKH5ZECPTSN",
        "type": "create_account",
        "type_i": 0,
        "state": 2,
        "identifier": "0",
        "ledger_close_time": "2017-05-04T11:15:06Z",
        "participants": [
          {
            "account_id": "GAHKZT6X4WIEDEET2P5PHOL4OEE24KMHTJ2IWZUWUR22YROGKUXKLIET",
            "email": "xadiz@cloud99.pro",
            "mobile_number": "+38012345679",
            "full_name": "John Doe"
          },
          {
            "account_id": "GDRYPVZ63SR7V2G46GKRGABJD3XPDNWQ4B4PQPJBTTDUEAKH5ZECPTSN"
          }
        ],
        "funder": "GDRYPVZ63SR7V2G46GKRGABJD3XPDNWQ4B4PQPJBTTDUEAKH5ZECPTSN",
        "account": "GAHKZT6X4WIEDEET2P5PHOL4OEE24KMHTJ2IWZUWUR22YROGKUXKLIET",
        "account_type": 2
      },

```
