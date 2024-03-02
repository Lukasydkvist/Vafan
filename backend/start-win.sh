SET NODE_ENV = development
node ./gateway/src/index.js  &
node ./users/src/index.js  &
node ./meetings/src/index.js 
