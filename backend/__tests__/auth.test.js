const bcrypt = require("bcrypt");

test("bcrypt hash et compare", async () => {
  const password = "123456";
  const hash = await bcrypt.hash(password, 10);

  const isMatch = await bcrypt.compare(password, hash);
  expect(isMatch).toBe(true); // ✅ Le test passe si password = hash
});