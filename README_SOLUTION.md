# RTC ADAPTER

For the sake of environment variables prefix, this service is called RTC_ADAPTER.

## Running

Install the dependencies:

`npm install`

Build and start the server:

`npm run build && npm run start`

Access the endpoint on the default port and path:

`curl http://localhost:3001/client/state`

(the port and path root can be configured, see "Environment Variables" below)

## Testing

Prettier:

- check: `npm run format`
- fix: `npm run format:fix`

Linter:

- check: `npm run lint`
- fix: `npm run lint:fix`

Unit tests:

`npm run build && npm run test`

⚠️ NOTE: If you get error:

- `Error: Cannot find module @rollup/rollup-darwin-x64.`

npm has a bug related to optional dependencies:

- https://github.com/npm/cli/issues/4828

Try:

- `rm -rvf node_modules package-lock.json` (remove node_modules and lock file)
- `npm install` (install dependencies again)
- `npm run build` (build the project)
- `npm run test` (run the tests)

## Environment Variables

| Name                                    | Description                                          | Default value                        |
| --------------------------------------- | ---------------------------------------------------- | ------------------------------------ |
| RTC_ADAPTER_API_PORT                    | A port to expose API to                              | 3001                                 |
| RTC_ADAPTER_ROOT_PATH                   | A path prefix to expose endpoints                    | /client                              |
| RTC_ADAPTER_STATE_UPDATE_INTERVAL_MS    | An interval between state updates in milliseconds    | 1000                                 |
| RTC_ADAPTER_MAPPINGS_UPDATE_INTERVAL_MS | An interval between mappings updates in milliseconds | 10000                                |
| RTC_ADAPTER_STATE_URL                   | URL of external state endpoint                       | `http://localhost:3000/api/state`    |
| RTC_ADAPTER_MAPPINGS_URL                | URL of external mappings endpoint                    | `http://localhost:3000/api/mappings` |

## Unspecified behavior

It wasn't clear wheather the mappings need to be refreshed periodically, so just in case I did a refresh defaulting to once per 10s. It can be easily disabled if not needed.

Currently the mappings and the odds state get replaced on updates. It is not clear if it would be better to append the data to the old one without knowing more context.

The current assumption is that the simulation endpoints always return the complete data. If this assumption is not correct then the cache service would need to be updated. Currently it replaces the data on every update for simplicity and to avoiid memory leaks.

## Debugging

There are few endpoints for debugging and displaying the internal state on various stages of data conversion. Normally they could be removed but they are left for demonstration of the thought process and the inner state of the application.

- `curl http://localhost:3001/client/internal/raw-data`
- `curl http://localhost:3001/client/internal/odds-orig`
- `curl http://localhost:3001/client/internal/odds-target`
- `curl http://localhost:3001/client/internal/odds-target-cached`

Main required endpoint:

- `curl http://localhost:3001/client/state`

## Dependencies

I used minimal number of external libraries for the task itself,
as requested in the README Guidelines.

However I added multiple dev dependencies (ESLint and Prettier plus plugins),
to enforce good practices for the code.

Express was used for the API routing because it suits the requirements and is popular and widely known, and there was no need for more complex frameworks like Nest. For such a simple endpoint we could even use the built-in `http` module directly, but that would not be readable and maintainable, so Express was a reasonable choice.

For the outgoing requests, the built-in `fetch()` was used (instead of e.g. Axios) to minimize external libraries.

For logging log4js was used for consistency with mysteriouscrawler/test.

## Improvements

Improvemenets that could be done to develop this into a real world project - some of those were not done to minimize the number of libraries used and simplify the execution, as requested in the task description.

- names - many of the symbols should probably be renamed to better names that would match the internal conventions and existing naming
- add `.env` file support (e.g. using `dotenv` library)
  - not done here to minimize libraries used as requested
- different HTTP server framework
  - maybe Fastify if we need fast framework with built-in validation
  - maybe NestJS if we need more complex structure and DI
  - maybe Hono if we need support for Deno or Bun
  - etc.
- add dependency injection
- add external cache, e.g. Redis
  - here not used as requested
- add proper request authentication and access control
  - here it was not required but in real world might be required, depending on how the server is deployed and accessed
- add Docker container for this service
  - now it is invoked as a local process for simplicity
- add CI workflows for the tests and coverage
- add more structure for the file layout
  - currently used flat structure and simple names for simplicity
- add better error handling and logging
  - now the errors are handles but could be improved
- improve utils
  - I wrote very simple utils to simplify requests and error handling but in real world project this would be more complex to handle different kinds of errors differently and hide verbose error messaged from the client
- remove `any` types in the tests
  - currently some mocks with `any` types were used in the tests for simplicity
  - instead of disabling the linter rules globally in the linter config for all tests, they are disabled only in specific test files, to remember to refactor it later
- add more test coverage
  - currently the most error-prone code is covered 100% or close to 100%
  - simple request handlers, server startup and boilerplate code is not covered so well
- clean up types
  - add enums to clarify the type definition
- split the tests
  - many files have 100% test coverage and the tests could be split into multiple files
- add more tests
  - some infrastructure and boilerplate parts of the code are not tested, as the focus was put to have 100% coverage on the parts that actually convert the data, rather than e.g. starting the server etc.
- some linter rules could be tweaked but in general they are pretty solid
