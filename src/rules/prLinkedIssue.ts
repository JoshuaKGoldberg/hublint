import type { Rule } from "../types/rules.js";

interface ClosingIssuesResponse {
	repository: {
		pullRequest: {
			closingIssuesReferences: {
				nodes: {
					number: number;
				}[];
			};
		};
	};
}

export const prLinkedIssue = {
	about: {
		config: "strict",
		description: "PRs must be linked as closing an issue.",
		name: "pr-linked-issue",
	},
	async pullRequest(context, entity) {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		const response = (await context.octokit.graphql(
			`
			query closingIssues($id: Int!, $owner: String!, $repository: String!) {
				repository(owner: $owner, name: $repository) {
					pullRequest(number: $id) {
						closingIssuesReferences(first: 1) {
							nodes {
								number
							}
						}
					}
				}
			}
			`,
			{
				id: entity.id,
				owner: context.locator.owner,
				repository: context.locator.repository,
			},
		)) as ClosingIssuesResponse;

		if (response.repository.pullRequest.closingIssuesReferences.nodes.length) {
			return;
		}

		context.report({
			primary: "This pull request is not linked as closing any issues.",
		});
	},
} satisfies Rule;
