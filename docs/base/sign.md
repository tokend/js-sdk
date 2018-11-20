# Signing

- JavaScript example:
    - secretKey it is not a `seed`, it formed by `seed` and `public key` by current implementation of **ed25519** library.

```javascript
// Example for Node.JS environment
var ed25519 = require("ed25519");
var data = new Buffer("Hello, SUN Network");
var secretKey = "secret key from keypair"
var signature = ed25519.Sign(data, secretKey);

signature = new Buffer(signature);
```

### Types
| Variable           | Type       | Definition                               |
| ------------------ | ---------- | ---------------------------------------- |
| signature          | byte array |                                          |
| signatureHint      | byte array | Last 4 bytes of the **public key**       |
| decoratedSignature | byte array | Concatenation of `signature_hint` and `signature` |