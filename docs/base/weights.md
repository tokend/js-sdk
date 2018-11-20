# Weights

##### Thresholds
Each operation has threshold — some "weight" a signer needs to have to submit it.
For example, Payment operation has high threshold.
There are 3 types: low, medium, high.
Thresholds are used along with another feature — account signers (keys to perform specific operations on behalf of exchange). Each signer has its weight.

##### Threshold update
*Has high threshold and must be signed with master key*

Each account has its own threshold weights.
To set thresholds, use operation setOptions this way:

```javascript
let opts = {
  lowThreshold,
  medThreshold,
  highThreshold,
  masterWeight
};
let op = JsSdk.Operation.setOptions(opts);
server.submitOperation(op, sourceID, signerKP);
```

| Name | Type | Meaning |
| ------ | ------ | ------ |
| lowThreshold | int | weight required for low threshold operations |
| medThreshold | int | weight required for medium threshold operations |
| highThreshold | int | weight required for high threshold operations|
| masterWeight | int | weight of the master key |
