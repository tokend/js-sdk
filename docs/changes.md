# Tokend vs stellar-core
**Tokend** is based on the open-source stellar's platform [stellar](github.com/stellar).
Tokend uses SCP as consensus protocol, concept of ledger
and have the data flow process as stellar-core.
However there are several important improvements.    

### Account and signer types
Basically, accounts in **stellar-core** all have equal
possibilities for performing any kind of operation.
**Tokend** introduces account types (e.g. master account, general account etc).
Any operation falls restrictions about account types which
could perform it. As an example, this change makes it possible to create very easily
certain system operations which should not be performed by ordinary accounts.
Tokend going farther and introduces signer types.
Both together this feature contributes to flexibility of how operations are performed.

### Issuance
One of the most noticeable change is the process of issuance of new assets.
In order to issue some amount of a new asset in **stellar-core**, the receiver must
hold a trust line in corresponding asset. The amount can be transferred to receiver via
payment operation.
**Tokend** uses more sophisticated approach and divides this process into  
processing of pre-issuance and issuance requests. Pre-issuance request can be created
only by the issuer of the asset (asset owner) and after approving leads to creating of
requested amount which is tracked by the system and doesn't belong to any account so far.
After amount is pre-issued, receiver of the
asset can request for this amount. In order to do so receiver must provide a valid signature
of asset owner in certain format bundled with a unique identifier (reference) of a corresponding
pre-issuance request. Such approach is much more safe and reliable.

### Flexible fee
**Stellar-core** have only a constant fee per transaction.
In **Tokend** it was implemented a reach system of fee charging which
gives and opportunity to set different fees for different operations (by introducing fee type),
set fees for each account type or even for certain account.
Also it is possible to charge a percent fee from an amount.

### Reviewable requests
Some operations are supposed to be reviewed by master account. **Tokend** implements this feature in
the form of reviewable requests.

### New operations
**Tokend** contains a big list of operations
comparing to **stellar-core** which is enough to fulfill needs encountered in common situations.
