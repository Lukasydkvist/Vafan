SET NODE_ENV = development
node ./users/src/index.js  &
node ./gateway/src/index.js  &
node ./meetings/src/index.js 
