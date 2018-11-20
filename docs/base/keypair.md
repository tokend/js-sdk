# Keypair

Each account has a Keypair: Public Key and Secret Key.

Keypair is a wrapper over `ed25519` keys. All methods (Generate, Sign, SignDecorated, Verify, etc) are provides by the library [`ed25519`](https://ed25519.cr.yp.to/).

Keys are used to manage account.

| Name       | Example                                  |
| ---------- | ---------------------------------------- |
| Public Key | GAHI5OY42LG6BM4EDDNTLLDNGPM3EYPGOJLDY563FIHUJOWJRHNHX566 |
| Secret Key | SBTFMA5ODLN7L7HZMTIRBSBPQDT34HJAYV5HZZHLVIAOVYLSDXQZ7AAU |


### Generate keypair

```javascript
let keyPair = JsSdk.Keypair.random();
let accountID = keyPair.accountId(); // public key of keypair
let seed = keyPair.seed(); // secret seed of keypair
```

### Restore keypair
```javascript
let keyPair = JsSdk.Keypair.fromSeed(seed);
```

### Sign data
Details described in [`Signing`](./sign.md)

```javascript
let keyPair = JsSdk.Keypair.random();
let data = 'Hello world';
let signature = keyPair.sign(data)
```

### Sign Decorated
Details described in [`Signing`](./sign.md)

The difference between [`sign`](#sign-data) and `signDecorated` is that in the `signDecorated` to the byte-array of the [`signatureHint`](./sign.md#types) merged with [`signature`](./sign.md#types)

- Example:

    ```javascript
        let keyPair = JsSdk.Keypair.random();
        let data = 'Hello world';
        let decoratedSignature = keyPair.signDecorated(data)
    ```