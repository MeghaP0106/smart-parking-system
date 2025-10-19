const { sum } = require('./hello'); // Adjust the import based on your actual backend functionality

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});