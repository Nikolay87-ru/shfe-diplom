const { expect } = require('@jest/globals');
const matchers = require('@testing-library/jest-dom/matchers');
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

expect.extend(matchers);