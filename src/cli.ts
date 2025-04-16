import { hublint } from "./index.js";
import { cliReporter } from "./reporters/cli.js";

export async function cli(url: string) {
	if (!url) {
		throw new Error("Please provide a url, like 'npx hublint github.com/...'");
	}

	console.log(`Checking ${url}...`);

	const reports = await hublint({ url });

	cliReporter(reports);
}
