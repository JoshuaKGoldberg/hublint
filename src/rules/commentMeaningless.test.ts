import { describe, expect, it, vi } from "vitest";

import { testRule } from "../tests/testRule.js";
import { commentMeaningless } from "./commentMeaningless.js";

describe(commentMeaningless.about.name, () => {
	it("does not report when the comment has no body text", async () => {
		const report = vi.fn();

		await testRule(
			commentMeaningless,
			{
				data: {
					body: "",
				},
				type: "comment",
			},
			{ report },
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the comment has meaningful body text", async () => {
		const report = vi.fn();

		await testRule(
			commentMeaningless,
			{
				data: {
					body: "mmh, yes, indeed, a fine point, thank you 🧐",
				},
				type: "comment",
			},
			{ report },
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("reports when the comment has meaningless body text", async () => {
		const report = vi.fn();

		await testRule(
			commentMeaningless,
			{
				data: {
					body: "+1",
				},
				type: "comment",
			},
			{ report },
		);

		expect(report).toHaveBeenCalledWith({
			primary:
				"Saying just '+1' is unnecessary: it doesn't add any new information to the discussion.",
			secondary: [
				"Although your enthusiasm is appreciated, posting a new comment gives everyone subscribed to the thread.",
				"It's generally better to give a GitHub emoji reaction instead.",
			],
		});
	});
});
