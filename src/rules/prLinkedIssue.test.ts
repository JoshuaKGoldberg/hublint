import { describe, expect, it, vi } from "vitest";

import { testRule } from "../tests/testRule.js";
import { prLinkedIssue } from "./prLinkedIssue.js";

describe(prLinkedIssue.about.name, () => {
	it("does not report when the pull request has a closing issue reference", async () => {
		const report = vi.fn();

		await testRule(
			prLinkedIssue,
			{
				data: {
					head: {
						ref: "patch-1",
					},
				},
				id: 2,
				type: "pull_request",
			},
			{
				octokit: {
					// https://github.com/sindresorhus/type-fest/issues/1107
					// @ts-expect-error -- this should be fully partial
					graphql: vi.fn().mockResolvedValue({
						repository: {
							pullRequest: {
								closingIssuesReferences: {
									nodes: [{ number: 1 }],
								},
							},
						},
					}),
				},
				report,
			},
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("reports when the pull request does not have a closing issue reference", async () => {
		const report = vi.fn();

		await testRule(
			prLinkedIssue,
			{
				data: {
					head: {
						ref: "main",
					},
				},
				id: 2,
				type: "pull_request",
			},
			{
				octokit: {
					// https://github.com/sindresorhus/type-fest/issues/1107
					// @ts-expect-error -- this should be fully partial
					graphql: vi.fn().mockResolvedValue({
						repository: {
							pullRequest: {
								closingIssuesReferences: {
									nodes: [],
								},
							},
						},
					}),
				},
				report,
			},
		);

		expect(report).toHaveBeenCalledWith({
			primary: "This pull request is not linked as closing any issues.",
		});
	});
});
