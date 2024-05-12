# Contributing

Keep in mind that this is a hybrid lib. It has to work in the following context

- Frontend JS projects
- Frontend TS projects
- Node JS projects
- Node TS projects
- Vitest

To achieve this you have to follow the currently configured settings for TS and Vitest.  
Additionally, you have to add `.js` to all imports. Ensure that your IDE is configured to handle it.

## HOW-TO

### Publish NPM package

This is handled through `release-it`, to publish a new NPM package version, run `npm run release`.
