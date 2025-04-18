import { octokitFromAuth } from "octokit-from-auth";

import type { RuleContext, RuleReport } from "./types/rules.js";

import { runRuleOnEntity } from "./execution/runRuleOnEntity.js";
import { resolveLintable } from "./resolvers/resolveEntity.js";
import { rules } from "./rules/index.js";

export interface OctoGuideSettings {
	githubToken?: string | undefined;
	url: string;
}

export async function runOctoGuide({ githubToken, url }: OctoGuideSettings) {
	const octokit = await octokitFromAuth({
		auth: githubToken,
	});

	const resolved = await resolveLintable(octokit, url);
	if (!resolved) {
		throw new Error("Could not resolve GitHub entity.");
	}

	const { entity, locator } = resolved;
	const reports: RuleReport[] = [];

	await Promise.all(
		Object.values(rules).map(async (rule) => {
			const context: RuleContext = {
				locator,
				octokit,
				report(data) {
					reports.push({
						about: rule.about,
						data,
					});
				},
			};

			await runRuleOnEntity(context, rule, entity);
		}),
	);

	return reports;
}
