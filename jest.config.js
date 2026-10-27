/** @type {import('jest').Config} */
export default {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  moduleNameMapper: {
    "\\.css$": "<rootDir>/src/test/styleStub.ts",
    "\\.wav$": "<rootDir>/src/test/fileStub.ts",
  },
  clearMocks: true,
};
