import { Octokit } from "octokit";

import type { ConfigName } from "./configs.js";
import type { RepositoryLocator } from "./data.js";
import type {
	CommentEntity,
	Entity,
	IssueEntity,
	PullRequestEntity,
} from "./entities.js";

export interface Rule {
	about: RuleAbout;
	comment?: RuleListener<CommentEntity>;
	issue?: RuleListener<IssueEntity>;
	pullRequest?: RuleListener<PullRequestEntity>;
}

export interface RuleAbout {
	config: ConfigName;
	description: string;
	name: string;
}

export interface RuleContext {
	locator: RepositoryLocator;
	octokit: Octokit;
	report: RuleReporter;
}

export type RuleListener<Located extends Entity> = (
	context: RuleContext,
	entity: Located,
) => Promise<void> | void;

export interface RuleReport {
	about: RuleAbout;
	data: RuleReportData;
}

export interface RuleReportData {
	primary: string;
	secondary?: string[];
}

export type RuleReporter = (data: RuleReportData) => void;
