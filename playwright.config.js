const { defineConfig } = require("@playwright/test");
module.exports = defineConfig({
	testDir: "./e2e",
	workers: 1,
	retries: 0,
	use: {
		baseURL: "http://127.0.0.1:5174",
		browserName: "chromium",
		screenshot: "only-on-failure"
	},
	webServer: {
		command: "node scripts/browser-fixture.cjs",
		port: 5174,
		reuseExistingServer: !process.env.CI
	}
});
