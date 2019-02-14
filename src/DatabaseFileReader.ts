'use strict';

import * as vscode from 'vscode';

/**
 * Class offering reading functions
 *
 * @export
 * @class DatabaseFileReader
 */
export class DatabaseFileReader {
    /**
     * Database as TextDocument
     *
     * @type {vscode.TextDocument}
     * @memberof DatabaseFileReader
     */
    textDocument: vscode.TextDocument = undefined;
    /**
     * Uri of the document
     *
     * @type {vscode.Uri}
     * @memberof DatabaseFileReader
     */
    uri: vscode.Uri = undefined;
    constructor(uri: vscode.Uri) {
        this.uri = uri;
    }
    /**
     * Open the dbc file to read.
     *
     * @memberof DatabaseFileReader
     */
    async open() {
        this.textDocument = await vscode.workspace.openTextDocument(this.uri);
    }

    /**
     * Return all environment variables, messages, and signals names in the database
     *
     * @returns {Promise<string[]>}
     * @memberof DatabaseFileReader
     */
    async getAllSymbolsNames(): Promise<string[]> {
        let array = [];
        if (this.textDocument == undefined) {
            await this.open();
        }
        for (let i = 0; i < this.textDocument.lineCount; i++) {
            const textline = this.textDocument.lineAt(i).text;
            const linearray = textline.split(' ');
            const symbolDefinition = linearray[0];
            switch (symbolDefinition) {
                case "EV_":
                    array.push(linearray[1].split(':')[0]);
                    break;
                case "BO_":
                    array.push(linearray[2].split(':')[0]);
                    break;
                case "SG_":
                    array.push(linearray[1].split(':')[0]);
                    break;
                default:
                    break;
            }
        }
        return array;
    }
}
