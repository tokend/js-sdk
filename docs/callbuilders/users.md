# Users

## Overview

In order to read information about payments from a Horizon server, the [`server`](./server.md) object provides the `users()` function. 
`users()` returns an `UserCallBuilder` class, an extension of the [`CallBuilder`](./call_builder.md) class.

By default, `users()` provides access to the `users_all` Horizon endpoint.  By chaining other methods to it, you can reach other operation endpoints.

## Methods

| Method           | Param Type | Description             |
| ---------------- | ---------- | ----------------------- |
| `users()`        |            | Load all users.         |
| `.accountId(id)` | `string`   | Load single user by id. |
