import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';
import { exec } from "child_process";
import { promisify } from "util";
import os from 'os';
import dotenv from "dotenv";
import fs from "fs/promises";
import pathModule from "path";



dotenv.config();

const platform = os.platform();

const asyncExecute = promisify(exec);

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY
});

//tool for executing terminal command 
async function executeCommand({ command }) {
	try {

		const result =
			await asyncExecute(command);

		return {
			success: true,
			stdout: result.stdout,
			stderr: result.stderr
		};

	} catch (error) {

		return {
			success: false,
			error: error.message
		};
	}
}

const executeCommandDeclaration = {
	name: "executeCommand",
	description:
		"Create directories using mkdir commands only.",
	parameters: {
		type: 'object',
		properties: {
			command: {
				type: 'string',
				description: 'It will be a single terminal command. eg "mkdir calculator"'
			},
		},
		required: ['command']
	}
}
async function writeFile({ path, content }) {
	try {

		await fs.mkdir(
			pathModule.dirname(path),
			{ recursive: true }
		);

		await fs.writeFile(path, content);

		return {
			success: true,
			path
		};

	} catch (error) {

		return {
			success: false,
			error: error.message
		};
	}
}
const writeFileDeclaration = {
	name: "writeFile",
	description: "Write content to a file",
	parameters: {
		type: "object",
		properties: {
			path: {
				type: "string"
			},
			content: {
				type: "string"
			}
		},
		required: ["path", "content"]
	}
};
const availableTools = {
	executeCommand,
	writeFile
}



async function runAgent(userProblem) {

	const History = [];

	History.push({
		role: "user",
		parts: [{ text: userProblem }]
	});

	while (true) {

		let response;

		try {

			response = await ai.models.generateContent({
				model: "gemini-2.5-flash",
				contents: History,
				config: {
					systemInstruction: `You are a website builder agent.

Current OS: ${platform}

Rules:

1. Use executeCommand ONLY for mkdir commands.

2. Use writeFile for ALL file creation and updates.

3. Never use:
   - echo
   - touch
   - cat
   - copy
   - fs commands inside shell

4. First create the project folder.

5. Then create:
   - index.html
   - style.css
   - script.js

6. Then write complete code into each file using writeFile.
`,
					tools: [{
						functionDeclarations: [
							executeCommandDeclaration,
							writeFileDeclaration
						]
					}]
				}
			});

		} catch (error) {

			if (error.status === 429) {
				console.log("❌ Gemini quota exceeded. Try again later.");
				return;
			}

			console.error("Gemini Error:", error);
			return;
		}

		console.log("---------------");
		console.log("FUNCTION CALLS:", response.functionCalls);
		console.log("TEXT:", response.text);
		console.log("---------------");

		// Tool calling phase
		if (
			response.functionCalls &&
			response.functionCalls.length > 0
		) {

			for (const toolCall of response.functionCalls) {

				const { name, args } = toolCall;

				const tool = availableTools[name];

				if (!tool) {
					console.log(`Tool not found: ${name}`);
					continue;
				}

				const result = await tool(args);

				console.log(`${name} result:`, result);

				// Add tool call to history
				History.push({
					role: "model",
					parts: [
						{
							functionCall: toolCall
						}
					]
				});

				// Add tool response to history
				History.push({
					role: "user",
					parts: [
						{
							functionResponse: {
								name,
								response: {
									result
								}
							}
						}
					]
				});
			}

			continue;
		}

		// Final response from model
		History.push({
			role: "model",
			parts: [
				{
					text: response.text
				}
			]
		});

		console.log("\n✅ WEBSITE CREATION COMPLETED\n");
		console.log(response.text);

		break;
	}
}


async function main() {

	console.log(
		"I am a cursor: let's create a website"
	);

	while (true) {

		const userProblem =
			readlineSync.question(
				"Ask me anything--> "
			);

		await runAgent(userProblem);
	}
}


main();





