const list = require("../api/list");

test('list all notes for user', () => {
    expect(list())
});