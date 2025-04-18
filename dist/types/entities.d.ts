import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
export type CommentData = RestEndpointMethodTypes["issues"]["getComment"]["response"]["data"];
export interface CommentEntity {
    commentId: number;
    data: CommentData;
    parent: IssueData;
    type: "comment";
    user?: string;
}
export type Entity = CommentEntity | IssueEntity | PullRequestEntity;
export type IssueData = RestEndpointMethodTypes["issues"]["get"]["response"]["data"];
export interface IssueEntity {
    data: IssueData;
    id: number;
    type: "issue";
    user?: string;
}
export type PullRequestData = RestEndpointMethodTypes["pulls"]["get"]["response"]["data"];
export interface PullRequestEntity {
    data: PullRequestData;
    id: number;
    type: "pull_request";
    user: string;
}
//# sourceMappingURL=entities.d.ts.map