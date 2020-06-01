# Image retriever API documentation

In this file is explained how to retrieve images directly from the endpoint enabled for this.

## Retrieve Feed picture

To retrieve feed images you must be to do a request to this endpoint:

`GET /file/picture`

With this parameters:

* `type` : `feed`

* `id` : Feed unique OID

## Retrieve User profile picture

### With picture OID

To retrieve user profile picture based on the picture OID you must be to do a request to this endpoint:

`GET /file/picture`

With this parameters:

* `type` : `user`

* `id` : User profile picture unique OID

### With username

To retrieve user profile picture based on the username you must be to do a request to this endpoint:

`GET /file/picture`

With this parameters:

* `type` : `username`

* `username` : User unique username
