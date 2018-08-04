describe("server.js tests", function () {
  beforeEach(function () {
    this.server = new StellarSdk.Server('https://horizon-live.stellar.org:1337');
    this.axiosMock = sinon.mock(axios);
    StellarSdk.Config.setDefault();
  });

  afterEach(function () {
    this.axiosMock.verify();
    this.axiosMock.restore();
  });

  describe('Server.constructor', function () {
    it("throws error for insecure server", function () {
      expect(() => new StellarSdk.Server('http://horizon-live.stellar.org:1337')).to.throw(/Cannot connect to insecure horizon server/);
    });

    it("allow insecure server when opts.allowHttp flag is set", function () {
      expect(() => new StellarSdk.Server('http://horizon-live.stellar.org:1337', {allowHttp: true})).to.not.throw();
    });

    it("allow insecure server when global Config.allowHttp flag is set", function () {
      StellarSdk.Config.setAllowHttp(true);
      expect(() => new StellarSdk.Server('http://horizon-live.stellar.org:1337')).to.not.throw();
    });
  });

  describe('Server.loadAccount', function () {
    let accountResponse = {
      "_links": {
        "self": {
          "href": "https://horizon-testnet.stellar.org/accounts/GBAH7FQMC3CZJ4WD6GE7G7YXCIU36LC2IHXQ7D5MQAUO4PODOWIVLSFS"
        },
        "transactions": {
          "href": "https://horizon-testnet.stellar.org/accounts/GBAH7FQMC3CZJ4WD6GE7G7YXCIU36LC2IHXQ7D5MQAUO4PODOWIVLSFS/transactions{?cursor,limit,order}",
          "templated": true
        },
        "operations": {
          "href": "https://horizon-testnet.stellar.org/accounts/GBAH7FQMC3CZJ4WD6GE7G7YXCIU36LC2IHXQ7D5MQAUO4PODOWIVLSFS/operations{?cursor,limit,order}",
          "templated": true
        },
        "payments": {
          "href": "https://horizon-testnet.stellar.org/accounts/GBAH7FQMC3CZJ4WD6GE7G7YXCIU36LC2IHXQ7D5MQAUO4PODOWIVLSFS/payments{?cursor,limit,order}",
          "templated": true
        },
      },
      "id": "GBAH7FQMC3CZJ4WD6GE7G7YXCIU36LC2IHXQ7D5MQAUO4PODOWIVLSFS",
      "paging_token": "5387216134082561",
      "account_id": "GBAH7FQMC3CZJ4WD6GE7G7YXCIU36LC2IHXQ7D5MQAUO4PODOWIVLSFS",
      "sequence": "5387216134078475",
      "subentry_count": 5,
      "thresholds": {
        "low_threshold": 0,
        "med_threshold": 0,
        "high_threshold": 0
      },
      "flags": {
        "auth_required": false,
        "auth_revocable": false
      },
      "balances": [
        {
          "balance": "0.0000000",
          "limit": "922337203685.4775807",
          "asset_type": "credit_alphanum4",
          "asset_code": "AAA",
          "asset_issuer": "GAX4CUJEOUA27MDHTLSQCFRGQPEXCC6GMO2P2TZCG7IEBZIEGPOD6HKF"
        },
        {
          "balance": "5000.0000000",
          "limit": "922337203685.4775807",
          "asset_type": "credit_alphanum4",
          "asset_code": "MDL",
          "asset_issuer": "GAX4CUJEOUA27MDHTLSQCFRGQPEXCC6GMO2P2TZCG7IEBZIEGPOD6HKF"
        },
        {
          "balance": "10000.0000000",
          "limit": "922337203685.4775807",
          "asset_type": "credit_alphanum4",
          "asset_code": "USD",
          "asset_issuer": "GAX4CUJEOUA27MDHTLSQCFRGQPEXCC6GMO2P2TZCG7IEBZIEGPOD6HKF"
        },
        {
          "balance": "70.0998900",
          "asset_type": "native"
        }
      ],
      "signers": [
        {
          "public_key": "GBAH7FQMC3CZJ4WD6GE7G7YXCIU36LC2IHXQ7D5MQAUO4PODOWIVLSFS",
          "weight": 1
        }
      ],
      "data": {}
    };

    it("returns AccountResponse object", function (done) {
      this.axiosMock.expects('get')
        .withArgs(sinon.match('https://horizon-live.stellar.org:1337/accounts/GBAH7FQMC3CZJ4WD6GE7G7YXCIU36LC2IHXQ7D5MQAUO4PODOWIVLSFS'))
        .returns(Promise.resolve({ data: accountResponse }));

      this.server.loadAccount("GBAH7FQMC3CZJ4WD6GE7G7YXCIU36LC2IHXQ7D5MQAUO4PODOWIVLSFS")
        .then(response => {
          // Response data
          expect(response.account_id).to.be.equal("GBAH7FQMC3CZJ4WD6GE7G7YXCIU36LC2IHXQ7D5MQAUO4PODOWIVLSFS");
          expect(response.subentry_count).to.be.equal(5);
          expect(response.transactions).to.be.function;
          expect(response.operations).to.be.function;
          expect(response.payments).to.be.function;
          // AccountResponse methods
          expect(response.sequenceNumber()).to.be.equal("5387216134078475");
          expect(response.sequence).to.be.equal("5387216134078475");
          response.incrementSequenceNumber()
          expect(response.sequenceNumber()).to.be.equal("5387216134078476");
          expect(response.sequence).to.be.equal("5387216134078476");
          done();
        })
        .catch(function (err) {
          done(err);
        });
      })
    });

  describe('Server._sendResourceRequest', function () {

    describe("requests all ledgers", function () {
      let ledgersResponse = {
        "_embedded": {
          "records": [
            {
              "_links": {
                "operations": {
                  "href": "/ledgers/1/operations{?cursor,limit,order}",
                  "templated": true
                },
                "self": {
                  "href": "/ledgers/1"
                },
                "transactions": {
                  "href": "/ledgers/1/transactions{?cursor,limit,order}",
                  "templated": true
                }
              },
              "id": "63d98f536ee68d1b27b5b89f23af5311b7569a24faf1403ad0b52b633b07be99",
              "paging_token": "4294967296",
              "hash": "63d98f536ee68d1b27b5b89f23af5311b7569a24faf1403ad0b52b633b07be99",
              "sequence": 1,
              "transaction_count": 0,
              "operation_count": 0,
              "closed_at": "1970-01-01T00:00:00Z"
            }
          ]
        },
        "_links": {
          "next": {
            "href": "/ledgers?order=asc\u0026limit=1\u0026cursor=4294967296"
          },
          "prev": {
            "href": "/ledgers?order=desc\u0026limit=1\u0026cursor=4294967296"
          },
          "self": {
            "href": "/ledgers?order=asc\u0026limit=1\u0026cursor="
          }
        }
      };

      describe("without options", function () {
        it("requests the correct endpoint", function (done) {
          this.axiosMock.expects('get')
            .withArgs(sinon.match('https://horizon-live.stellar.org:1337/ledgers'))
            .returns(Promise.resolve({ data: ledgersResponse }));

          this.server.ledgers()
            .call()
            .then(response => {
              expect(response.records).to.be.deep.equal(ledgersResponse._embedded.records);
              expect(response.next).to.be.function;
              expect(response.prev).to.be.function;
              done();
            })
            .catch(function (err) {
              done(err);
            });
        })
      });

      describe("with options", function () {
        beforeEach(function () {
          this.axiosMock.expects('get')
            .withArgs(sinon.match('https://horizon-live.stellar.org:1337/ledgers?limit=1&cursor=b&order=asc'))
            .returns(Promise.resolve({ data: ledgersResponse }));
        });

        it("requests the correct endpoint", function (done) {
          this.server.ledgers()
            .limit("1")
            .cursor("b")
            .order("asc")
            .call()
            .then(response => {
              expect(response.records).to.be.deep.equal(ledgersResponse._embedded.records);
              expect(response.next).to.be.function;
              expect(response.prev).to.be.function;
              done();
            })
        });

        it("can call .next() on the result to retrieve the next page", function (done) {
          this.axiosMock.expects('get')
            .withArgs(sinon.match('https://horizon-live.stellar.org:1337/ledgers?order=asc&limit=1&cursor=4294967296'))
            .returns(Promise.resolve(({ data: ledgersResponse })));

          this.server
            .ledgers()
            .limit("1")
            .cursor("b")
            .order("asc")
            .call()
            .then(function (page) {
              page.next().then(function (response) {
                expect(response.records).to.be.deep.equal(ledgersResponse._embedded.records);
                expect(response.next).to.be.function;
                expect(response.prev).to.be.function;
                done();
              });
            });
        });
      });
    });

    describe("requests a single ledger", function () {
      let singleLedgerResponse = {
        "_links": {
          "operations": {
            "href": "/ledgers/1/operations{?cursor,limit,order}",
            "templated": true
          },
          "self": {
            "href": "/ledgers/1"
          },
          "transactions": {
            "href": "/ledgers/1/transactions{?cursor,limit,order}",
            "templated": true
          }
        },
        "id": "63d98f536ee68d1b27b5b89f23af5311b7569a24faf1403ad0b52b633b07be99",
        "paging_token": "4294967296",
        "hash": "63d98f536ee68d1b27b5b89f23af5311b7569a24faf1403ad0b52b633b07be99",
        "sequence": 1,
        "transaction_count": 0,
        "operation_count": 0,
        "closed_at": "1970-01-01T00:00:00Z"
      };

      describe("for a non existent ledger", function () {
        it("throws a NotFoundError", function (done) {
          this.axiosMock.expects('get')
            .withArgs(sinon.match('https://horizon-live.stellar.org:1337/ledgers/1'))
            .returns(Promise.reject({ status: 404, data: {} }));

          this.server.ledgers()
            .ledger(1)
            .call()
            .then(function () {
              done("didn't throw an error");
            })
            .catch(StellarSdk.NotFoundError, function (err) {
              done();
            })
            .catch(function (err) {
              done(err);
            })
        })
      });
      describe("without options", function () {
        it("requests the correct endpoint", function (done) {
          this.axiosMock.expects('get')
            .withArgs(sinon.match('https://horizon-live.stellar.org:1337/ledgers/1'))
            .returns(Promise.resolve({ data: singleLedgerResponse }));

          this.server.ledgers()
            .ledger("1")
            .call()
            .then(function (response) {
              expect(response).to.be.deep.equal(singleLedgerResponse);
              done();
            })
            .catch(function (err) {
              done(err);
            })
        });
      });

      describe("with options", function () {
        it("requests the correct endpoint", function (done) {
          this.axiosMock.expects('get')
            .withArgs(sinon.match('https://horizon-live.stellar.org:1337/ledgers/1?limit=1&cursor=b&order=asc'))
            .returns(Promise.resolve({ data: singleLedgerResponse }));

          this.server.ledgers()
            .ledger("1")
            .limit("1")
            .cursor("b")
            .order("asc")
            .call()
            .then(function (response) {
              expect(response).to.be.deep.equal(singleLedgerResponse);
              done();
            })
            .catch(function (err) {
              done(err);
            })
        });
      });
    });

    describe("requests a sub resource", function (done) {
      let transactionsResponse = {
        "_embedded": {
          "records": [
            {
              "_links": {
                "account": {
                  "href": "/accounts/GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H"
                },
                "ledger": {
                  "href": "/ledgers/34"
                },
                "operations": {
                  "href": "/transactions/991534d902063b7715cd74207bef4e7bd7aa2f108f62d3eba837ce6023b2d4f3/operations{?cursor,limit,order}",
                  "templated": true
                },
                "precedes": {
                  "href": "/transactions?cursor=146028892160\u0026order=asc"
                },
                "self": {
                  "href": "/transactions/991534d902063b7715cd74207bef4e7bd7aa2f108f62d3eba837ce6023b2d4f3"
                },
                "succeeds": {
                  "href": "/transactions?cursor=146028892160\u0026order=desc"
                }
              },
              "id": "991534d902063b7715cd74207bef4e7bd7aa2f108f62d3eba837ce6023b2d4f3",
              "paging_token": "146028892160",
              "hash": "991534d902063b7715cd74207bef4e7bd7aa2f108f62d3eba837ce6023b2d4f3",
              "ledger": 34,
              "created_at": "2015-09-29T23:38:10Z",
              "account": "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H",
              "account_sequence": 1,
              "max_fee": 0,
              "fee_paid": 0,
              "operation_count": 1,
              "result_code": 0,
              "result_code_s": "tx_success",
              "envelope_xdr": "AAAAAGL8HQvQkbK2HA3WVjRrKmjX00fG8sLI7m0ERwJW/AX3AAAAZAAAAAAAAAABAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAZc2EuuEa2W1PAKmaqVquHuzUMHaEiRs//+ODOfgWiz8AAFrzEHpAAAAAAAAAAAABVvwF9wAAAECdBs6M1RCYGMBFKqFb4hmJ3wafkfSE8oXELydY/U1VBmfHcr6QtHmRPgAhkf5dUBwHigKhNKcpvb6v66ClyGoN",
              "result_xdr": "AAAAAAAAAGQAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAA=",
              "result_meta_xdr": "AAAAAAAAAAEAAAACAAAAAAAAACIAAAAAAAAAAGXNhLrhGtltTwCpmqlarh7s1DB2hIkbP//jgzn4Fos/AABa8xB6QAAAAAAiAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAQAAACIAAAAAAAAAAGL8HQvQkbK2HA3WVjRrKmjX00fG8sLI7m0ERwJW/AX3DeBbwJbpv5wAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAA"
            }
          ]
        },
        "_links": {
          "next": {
            "href": "/transactions?order=asc\u0026limit=1\u0026cursor=146028892160"
          },
          "prev": {
            "href": "/transactions?order=desc\u0026limit=1\u0026cursor=146028892160"
          },
          "self": {
            "href": "/transactions?order=asc\u0026limit=1\u0026cursor="
          }
        }
      };

      describe("without options", function () {
        it("requests the correct endpoint", function (done) {
          this.axiosMock.expects('get')
            .withArgs(sinon.match('https://horizon-live.stellar.org:1337/ledgers/1/transactions'))
            .returns(Promise.resolve({ data: transactionsResponse }));

          this.server.transactions()
            .forLedger("1")
            .call()
            .then(function (response) {
              expect(response.records).to.be.deep.equal(transactionsResponse._embedded.records);
              expect(response.next).to.be.function;
              expect(response.prev).to.be.function;
              done();
            })
            .catch(function (err) {
              done(err);
            })
        });
      });
      describe("with options", function () {
        it("requests the correct endpoint", function (done) {
          this.axiosMock.expects('get')
            .withArgs(sinon.match('https://horizon-live.stellar.org:1337/ledgers/1/transactions?cursor=b&limit=1&order=asc'))
            .returns(Promise.resolve({ data: transactionsResponse }));

          this.server.transactions()
            .forLedger("1")
            .cursor("b")
            .limit("1")
            .order("asc")
            .call()
            .then(function (response) {
              expect(response.records).to.be.deep.equal(transactionsResponse._embedded.records);
              expect(response.next).to.be.function;
              expect(response.prev).to.be.function;
              done();
            })
            .catch(function (err) {
              done(err);
            })
        });
      });
    });
  });

  describe("Server._parseResult", function () {
    it("creates link functions", function () {
      var callBuilder = this.server.ledgers();
      var json = callBuilder._parseResponse({
        "_links": {
          "test": function () {
            return "hi";
          }
        }
      });
      expect(typeof json.test).to.be.equal("function");
    });
  });

  describe("Smoke tests for the rest of the builders", function() {
    describe("AccountCallBuilder", function() {
      let singleAccountResponse = {
        "_links": {
          "operations": {
            "href": "/accounts/GBS43BF24ENNS3KPACUZVKK2VYPOZVBQO2CISGZ777RYGOPYC2FT6S3K/operations{?cursor,limit,order}",
            "templated": true
          },
          "self": {
            "href": "/accounts/GBS43BF24ENNS3KPACUZVKK2VYPOZVBQO2CISGZ777RYGOPYC2FT6S3K"
          },
          "transactions": {
            "href": "/accounts/GBS43BF24ENNS3KPACUZVKK2VYPOZVBQO2CISGZ777RYGOPYC2FT6S3K/transactions{?cursor,limit,order}",
            "templated": true
          }
        },
        "id": "GBS43BF24ENNS3KPACUZVKK2VYPOZVBQO2CISGZ777RYGOPYC2FT6S3K",
        "paging_token": "146028892161",
        "account_id": "GBS43BF24ENNS3KPACUZVKK2VYPOZVBQO2CISGZ777RYGOPYC2FT6S3K",
        "sequence": 146028888090,
        "subentry_count": 0,
        "inflation_destination": null,
        "home_domain": "",
        "thresholds": {
          "low_threshold": 0,
          "med_threshold": 0,
          "high_threshold": 0
        },
        "flags": {
          "auth_required": false,
          "auth_revocable": false
        },
        "balances": [
          {
            "asset_type": "native",
            "balance": "9760000.3997400"
          }
        ],
        "signers": [
          {
            "public_key": "GBS43BF24ENNS3KPACUZVKK2VYPOZVBQO2CISGZ777RYGOPYC2FT6S3K",
            "weight": 1
          }
        ]
      };

      it("requests the correct endpoint", function (done) {
        this.axiosMock.expects('get')
          .withArgs(sinon.match('https://horizon-live.stellar.org:1337/accounts/GBS43BF24ENNS3KPACUZVKK2VYPOZVBQO2CISGZ777RYGOPYC2FT6S3K'))
          .returns(Promise.resolve({data: singleAccountResponse}));

        this.server.accounts()
          .accountId("GBS43BF24ENNS3KPACUZVKK2VYPOZVBQO2CISGZ777RYGOPYC2FT6S3K")
          .call()
          .then(function (response) {
            expect(response).to.be.deep.equal(singleAccountResponse);
            done();
          })
          .catch(function (err) {
            done(err);
          })
      });
    });

    describe("OperationCallBuilder", function() {
      let operationsResponse = {
        "_embedded": {
          "records": [
            {
              "_links": {
                "precedes": {
                  "href": "/operations?cursor=146028892161\u0026order=asc"
                },
                "self": {
                  "href": "/operations/146028892161"
                },
                "succeeds": {
                  "href": "/operations?cursor=146028892161\u0026order=desc"
                },
                "transaction": {
                  "href": "/transactions/991534d902063b7715cd74207bef4e7bd7aa2f108f62d3eba837ce6023b2d4f3"
                }
              },
              "account": "GBS43BF24ENNS3KPACUZVKK2VYPOZVBQO2CISGZ777RYGOPYC2FT6S3K",
              "funder": "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H",
              "id": 146028892161,
              "paging_token": "146028892161",
              "starting_balance": "10000000.0",
              "type": 0,
              "type_s": "create_account"
            }
          ]
        },
        "_links": {
          "next": {
            "href": "/operations?order=asc\u0026limit=1\u0026cursor=146028892161"
          },
          "prev": {
            "href": "/operations?order=desc\u0026limit=1\u0026cursor=146028892161"
          },
          "self": {
            "href": "/operations?order=asc\u0026limit=1\u0026cursor="
          }
        }
      };

      it("operation() requests the correct endpoint", function (done) {
        this.axiosMock.expects('get')
          .withArgs(sinon.match('https://horizon-live.stellar.org:1337/operations/123456789'))
          .returns(Promise.resolve({data: operationsResponse}));

        this.server.operations()
          .operation("123456789")
          .call()
          .then(function (response) {
            expect(response.records).to.be.deep.equal(operationsResponse._embedded.records);
            expect(response.next).to.be.function;
            expect(response.prev).to.be.function;
            done();
          })
          .catch(function (err) {
            done(err);
          })
      });

      it("forAccount() requests the correct endpoint", function (done) {
        this.axiosMock.expects('get')
          .withArgs(sinon.match('https://horizon-live.stellar.org:1337/accounts/GCGHCFUB6JKQE42C76BK2LYB3EHKP4WQJE624WTSL3CU2PPDYE5RBMJE/operations'))
          .returns(Promise.resolve({data: operationsResponse}));

        this.server.operations()
          .forAccount("GCGHCFUB6JKQE42C76BK2LYB3EHKP4WQJE624WTSL3CU2PPDYE5RBMJE")
          .call()
          .then(function (response) {
            expect(response.records).to.be.deep.equal(operationsResponse._embedded.records);
            expect(response.next).to.be.function;
            expect(response.prev).to.be.function;
            done();
          })
          .catch(function (err) {
            done(err);
          })
      });

      it("forLedger() requests the correct endpoint", function (done) {
        this.axiosMock.expects('get')
          .withArgs(sinon.match('https://horizon-live.stellar.org:1337/ledgers/123456789/operations'))
          .returns(Promise.resolve({data: operationsResponse}));

        this.server.operations()
          .forLedger("123456789")
          .call()
          .then(function (response) {
            expect(response.records).to.be.deep.equal(operationsResponse._embedded.records);
            expect(response.next).to.be.function;
            expect(response.prev).to.be.function;
            done();
          })
          .catch(function (err) {
            done(err);
          })
      });

      it("forTransaction() requests the correct endpoint", function (done) {
        this.axiosMock.expects('get')
          .withArgs(sinon.match('https://horizon-live.stellar.org:1337/transactions/blah/operations'))
          .returns(Promise.resolve({data: operationsResponse}));

        this.server.operations()
          .forTransaction("blah")
          .call()
          .then(function (response) {
            expect(response.records).to.be.deep.equal(operationsResponse._embedded.records);
            expect(response.next).to.be.function;
            expect(response.prev).to.be.function;
            done();
          })
          .catch(function (err) {
            done(err);
          })
      });
    });

    describe("PaymentCallBuilder", function() {
      let paymentsResponse = {
        "_embedded": {
          "records": [
            {
              "_links": {
                "precedes": {
                  "href": "/operations?cursor=146028892161\u0026order=asc"
                },
                "self": {
                  "href": "/operations/146028892161"
                },
                "succeeds": {
                  "href": "/operations?cursor=146028892161\u0026order=desc"
                },
                "transaction": {
                  "href": "/transactions/991534d902063b7715cd74207bef4e7bd7aa2f108f62d3eba837ce6023b2d4f3"
                }
              },
              "account": "GBS43BF24ENNS3KPACUZVKK2VYPOZVBQO2CISGZ777RYGOPYC2FT6S3K",
              "funder": "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H",
              "id": 146028892161,
              "paging_token": "146028892161",
              "starting_balance": "10000000.0",
              "type": 0,
              "type_s": "create_account"
            }
          ]
        },
        "_links": {
          "next": {
            "href": "/payments?order=asc\u0026limit=1\u0026cursor=146028892161"
          },
          "prev": {
            "href": "/payments?order=desc\u0026limit=1\u0026cursor=146028892161"
          },
          "self": {
            "href": "/payments?order=asc\u0026limit=1\u0026cursor="
          }
        }
      };

      it("forAccount() requests the correct endpoint", function (done) {
        this.axiosMock.expects('get')
          .withArgs(sinon.match('https://horizon-live.stellar.org:1337/accounts/GBS43BF24ENNS3KPACUZVKK2VYPOZVBQO2CISGZ777RYGOPYC2FT6S3K/payments'))
          .returns(Promise.resolve({data: paymentsResponse}));

        this.server.payments()
          .forAccount("GBS43BF24ENNS3KPACUZVKK2VYPOZVBQO2CISGZ777RYGOPYC2FT6S3K")
          .call()
          .then(function (response) {
            expect(response.records).to.be.deep.equal(paymentsResponse._embedded.records);
            expect(response.next).to.be.function;
            expect(response.prev).to.be.function;
            done();
          })
          .catch(function (err) {
            done(err);
          })
      });

      it("forLedger() requests the correct endpoint", function (done) {
        this.axiosMock.expects('get')
          .withArgs(sinon.match('https://horizon-live.stellar.org:1337/ledgers/123456789/payments'))
          .returns(Promise.resolve({data: paymentsResponse}));

        this.server.payments()
          .forLedger("123456789")
          .call()
          .then(function (response) {
            expect(response.records).to.be.deep.equal(paymentsResponse._embedded.records);
            expect(response.next).to.be.function;
            expect(response.prev).to.be.function;
            done();
          })
          .catch(function (err) {
            done(err);
          })
      });

      it("forTransaction() requests the correct endpoint", function (done) {
        this.axiosMock.expects('get')
          .withArgs(sinon.match('https://horizon-live.stellar.org:1337/transactions/77277606902d80a03a892536ebff8466726a4e55c3923ec2d3eeb3aa5bdc3731/payments'))
          .returns(Promise.resolve({data: paymentsResponse}));

        this.server.payments()
          .forTransaction("77277606902d80a03a892536ebff8466726a4e55c3923ec2d3eeb3aa5bdc3731")
          .call()
          .then(function (response) {
            expect(response.records).to.be.deep.equal(paymentsResponse._embedded.records);
            expect(response.next).to.be.function;
            expect(response.prev).to.be.function;
            done();
          })
          .catch(function (err) {
            done(err);
          })
      });

      it("unsigned pagination works", function (done) {
        this.axiosMock.expects('get')
          .withArgs(sinon.match('https://horizon-live.stellar.org:1337/transactions/77277606902d80a03a892536ebff8466726a4e55c3923ec2d3eeb3aa5bdc3731/payments'))
          .returns(Promise.resolve({data: paymentsResponse}));

        this.axiosMock.expects('get')
          .withArgs(sinon.match('https://horizon-live.stellar.org:1337/payments?order=asc&limit=1&cursor=146028892161'))
          .returns(Promise.resolve({data: paymentsResponse}));

        this.server.payments()
          .forTransaction("77277606902d80a03a892536ebff8466726a4e55c3923ec2d3eeb3aa5bdc3731")
          .call()
          .then(function (response) {
            response.next()
            .then(response => {
              expect(response.records).to.be.deep.equal(paymentsResponse._embedded.records);
              expect(response.next).to.be.function;
              expect(response.prev).to.be.function;  
            })
            done();
          })
          .catch(function (err) {
            done(err);
          })
      });

      it("signed pagination works", function (done) {
        let keypair = StellarSdk.Keypair.random();
        this.axiosMock.expects('get')
          .withArgs(sinon.match('https://horizon-live.stellar.org:1337/transactions/77277606902d80a03a892536ebff8466726a4e55c3923ec2d3eeb3aa5bdc3731/payments'))
          .returns(Promise.resolve({data: paymentsResponse}));

        this.axiosMock.expects('get')
          .withArgs(sinon.match('https://horizon-live.stellar.org:1337/payments?order=asc&limit=1&cursor=146028892161'))
          .returns(Promise.resolve({data: paymentsResponse}));

        this.server.payments()
          .forTransaction("77277606902d80a03a892536ebff8466726a4e55c3923ec2d3eeb3aa5bdc3731")
          .call()
          .then(function (response) {
            response.next(keypair)
            .then(response => {
              expect(response.records).to.be.deep.equal(paymentsResponse._embedded.records);
              expect(response.next).to.be.function;
              expect(response.prev).to.be.function;  
            })
            done();
          })
          .catch(function (err) {
            done(err);
          })
      });
    });

  describe("EmissionCallBuilder.Filter", function() {
    let emissionResponse = {
        "paging_token": "30",
        "issuer": "GARAGQNSP2MRAS34H2OZKHHFHVBQ36GDAWRA3N75COPCXTJE2RB2MTJM",
        "request_id": "471261612b149c74d132aeaba7a98fb94c52b8efc94ec5703711ab3e854d3ef2",
        "amount": "3.1234560",
        "approved": true,
        "details": "{\"key\": \"bf7518839bf6ae7f\", \"amount\": \"3.123456\", \"source\": \"GARAGQNSP2MRAS34H2OZKHHFHVBQ36GDAWRA3N75COPCXTJE2RB2MTJM\", \"timestamp\": 1489076665843, \"countryCode\": \"UA123\"}",
        "pre_emissions": [
          {
            "serialNumber": "GDXPOU6PBHNEHICOA76I56456IMMJQYXTDWBDHGVATTLRKPIEXOW3DDD",
            "amount": "3.1234560"
          }
        ],
        "reason": null,
        "created_at": "2017-03-09T16:24:35.822127Z",
        "updated_at": "2017-03-09T16:24:40.824544Z"
    };
    it("coinsEmissionRequest() requests the correct endpoint", function (done) {
      this.axiosMock.expects('get')
        .withArgs(sinon.match('https://horizon-live.stellar.org:1337/coins_emission_requests/471261612b149c74d132aeaba7a98fb94c52b8efc94ec5703711ab3e854d3ef2'))
        .returns(Promise.resolve({ data: emissionResponse }));

      this.server.emissionRequests()
        .coinsEmissionRequest("471261612b149c74d132aeaba7a98fb94c52b8efc94ec5703711ab3e854d3ef2")
        .call()
        .then(function (response) {
          expect(response).to.be.deep.equal(emissionResponse);
          expect(response.next).to.be.function;
          expect(response.prev).to.be.function;
          done();
        })
        .catch(function (err) {
          done(err);
        })
    });
    it("coinsEmissionRequest.forExchange requests the correct endpoint", function (done) {
      this.axiosMock.expects('get')
        .withArgs(sinon.match('https://horizon-live.stellar.org:1337/coins_emission_requests?exchange=GDD47E7OVZ6WZIJDPQD2FKKF54D4QXXMFKXI3MT7VKRE44RLXKD56BFG&state=1'))
        .returns(Promise.resolve({ data: emissionResponse }));

      this.server.emissionRequests()
        .forExchange("GDD47E7OVZ6WZIJDPQD2FKKF54D4QXXMFKXI3MT7VKRE44RLXKD56BFG")
        .forState(1)
        .call()
        .then(function (response) {
          expect(response).to.be.deep.equal(emissionResponse);
          expect(response.next).to.be.function;
          expect(response.prev).to.be.function;
          done();
        })
        .catch(function (err) {
          done(err);
        })
    });
  })

  describe("Available emission amount", function () {
    it("requests the correct endpoint", function (done) {
      this.axiosMock.expects('get')
        .withArgs(sinon.match('https://horizon-live.stellar.org:1337/available_emissions'))
        .returns(Promise.resolve({ data: '' }));

      this.server.available_emissions()
        .call()
        .then(response => {
          done();
        })
        .catch(function (err) {
          done(err);
        });
    })
  });

  describe("PaymentRequestCallBuilder.Filter", function() {
    let paymentRequestResponse = {
      "paging_token": '18',
      "exchange": 'GDUIGZ6EMWKKKL6U3BOOAZ25LIJNWO2MYIH7MY2SETOSKTXRQJS3UFWS',
      "payment_id": '160',
      "payment_state": 2,
      "accepted": true,
      "created_at": '2017-04-08T16:50:53.582656Z',
      "updated_at": '2017-04-08T16:50:58.578316Z',
      "payment_details": 
        { "from": 'GBDHBBOR2333B5FLW3VK4YK52N64FNCDBKHXMNYIAKV4ZGDAUN4BMZM4',
          "to": 'GBDHBBOR2333B5FLW3VK4YK52N64FNCDBKHXMNYIAKV4ZGDAUN4BMZM4',
          "amount": '250.0000',
          "payment_fee": '0.0000',
          "fee_from_source": false,
          "fixed_fee": '0.0000' 
      }
    };
    it("paymentRequest() requests the correct endpoint", function (done) {
      this.axiosMock.expects('get')
        .withArgs(sinon.match('https://horizon-live.stellar.org:1337/payment_requests/123'))
        .returns(Promise.resolve({ data: paymentRequestResponse }));

      this.server.paymentRequests()
        .paymentRequest("123")
        .call()
        .then(function (response) {
          expect(response).to.be.deep.equal(paymentRequestResponse);
          expect(response.next).to.be.function;
          expect(response.prev).to.be.function;
          done();
        })
        .catch(function (err) {
          done(err);
        })
    });
    it("paymentRequests.forExchange and for state requests the correct endpoint", function (done) {
      this.axiosMock.expects('get')
        .withArgs(sinon.match('https://horizon-live.stellar.org:1337/payment_requests?exchange=GDD47E7OVZ6WZIJDPQD2FKKF54D4QXXMFKXI3MT7VKRE44RLXKD56BFG&state=1'))
        .returns(Promise.resolve({ data: paymentRequestResponse }));

      this.server.paymentRequests()
        .forExchange("GDD47E7OVZ6WZIJDPQD2FKKF54D4QXXMFKXI3MT7VKRE44RLXKD56BFG")
        .forState(1)
        .call()
        .then(function (response) {
          expect(response).to.be.deep.equal(paymentRequestResponse);
          expect(response.next).to.be.function;
          expect(response.prev).to.be.function;
          done();
        })
        .catch(function (err) {
          done(err);
        })
    });
  })
});
});
