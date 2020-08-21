# Core-api-test
Core's API coding interview challenge.

## Background
Core needs a new lightweight API endpoint for a resource ([`Foo`](./app/models/foo.js)).

## Requirements
1. This endpoint should be [RESTful](https://tools.ietf.org/html/rfc7231) and should use the appropriate [HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).
2. Since this API is meant to be lightweight, any external dependencies should limited.
3. Resources should be represented by [JSON](https://www.json.org) payloads and stored in a MongoDB collection using [mongoose](https://mongoosejs.com) for modeling and validations.
4. Design and implmentation should follow the TDD methodolgy with ~100% code coverage for tests.
5. Code style should follow the installed and configured linting package as well as existing patterns for code structure.
6. All code will be under the [`app/`](./app) directory.

## In Scope
The new endpoint will be `/foos`. It will be a resource that exposes access to typical CRUD operations:
* Creating a new foo document
* Retrieving a list of foo documents
* Retrieving a particular foo document
* Updating a particular foo document
* Deleting a foo document

A foo document will have 5 properties:
* name (string; required; unique)
* foos (array of Ids; an array of unique foo document Ids associated with this document)
* data (object; required; a freeform object)
* created (timestamp; cannot be provided or updated in request, set at creation of document)
* modified (timestamp; cannot be provided in request, set at creation and modification of document)

## Out of Scope
Anything not explicity stated as in scope.

------

## Instructions
1. `npm install`
2. `npm test` to run the tests.
    - Please try `.\node_modules\.bin\eslint` (the path separator is \ on Windows) or eslint-cli or `npm install -g eslint-cli`.
    - `npm install jest --global` Or go to termial `npx jest app`
3. `npm test -- --coverage` to generate code coverage results.
    - `npx jest app --coverage`
4. Alternatively use `npm run watch` to run tests with code coverage while coding for red/green development.
5. `npm run submit` to generate a `submission.zip` that will be submitted to your talent representative.

## Notes
* Existing code should demonstrate expected code and testing patterns. However, if any questions arise, please reach out for clarification. Also, if you feel a better pattern is appropriate, please feel free to use it but document why you choose to.
* There is an [`.env.`](./.env) file that specifies `PORT` and `MONGO_URL`. You should only need to set `MONGO_URL` if you want to run the server on its own (`npm run start`).
* Existing code and tests are mostly undocumented and only stubbed out in certain circumstances. Please document and be thorough with your code and tests.

## Expectations
- Completion time should be approximately 2-3 hours or less but please finish all requirements.
- If your schedule permits, please complete any or all of bonuses below.
- Annotate code and tests as necessary for clarity.

## Bonuses
Please complete any or all of these additional requirements if time permits.
* Add middleware to the foos endpoint to check the format of the Id parameter; if invalid, return 404; if valid, proceed.
* When querying for a list of foos, provided a query parameter, `filter`, to filter the returned list.
* When requesting a particular foo document, if a query param of `include=foos` is provided, replace any referenced `foos` in the array with the actual document (no need to worry about recursion -- A single depth is fine);
* If a foo document is deleted that is included in a foos array for another foo document, it should also be removed from the array in that document.
* Add an autogenerated documentation process for the API. Pick your favorite that aligns best with the code structure.