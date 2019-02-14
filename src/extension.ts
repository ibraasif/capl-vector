'use strict';

import * as vscode from 'vscode';
import { DatabaseFileReader } from './DatabaseFileReader';

/**
 * Extension activation fonction
 *
 * @export
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext) {
	/* Custom CAPL completion providers registration */
	let symbolsProvider = vscode.languages.registerCompletionItemProvider('capl', new SymbolsCompletionItemProvider());
	context.subscriptions.push(symbolsProvider);
	console.log("ACTIVATED")
}

export function deactivate() {
	console.log("DEACTIVATED")
}


/**
 *Custom CompletionItemProvider responsible of registering environment variables, messages and signals contained in all .dbc files in the workspace
 *
 * @class SymbolsCompletionItemProvider
 * @implements {vscode.CompletionItemProvider}
 */
class SymbolsCompletionItemProvider implements vscode.CompletionItemProvider {

	async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
		let completionItemList: Array<vscode.CompletionItem> = [];

		const value = await vscode.workspace.findFiles('**/*.dbc', null);
		let varNameArray: string[] = undefined;
		for (let i = 0; i < value.length; i++) {
			const uri = value[i];
			const dbcFile = new DatabaseFileReader(uri);
			varNameArray = await dbcFile.getAllSymbolsNames();
		}
		varNameArray.forEach((varName: string) => {
			completionItemList.push(new vscode.CompletionItem(varName));
		});

		// return all completion items as array
		return completionItemList;
	};
}

