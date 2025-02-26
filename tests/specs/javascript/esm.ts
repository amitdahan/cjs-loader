import { testSuite, expect } from 'manten';
import semver from 'semver';
import type { NodeApis } from '../../utils/node-with-loader';
import nodeSupports from '../../utils/node-supports';

export default testSuite(async ({ describe }, node: NodeApis) => {
	describe('Load ESM', ({ describe }) => {
		describe('.mjs extension', ({ describe }) => {
			const output = 'loaded esm-ext-mjs/index.mjs {"nodePrefix":true,"hasDynamicImport":true,"nameInError":true,"sourceMap":true,"import.meta.url":true}';

			describe('full path', ({ test }) => {
				const importPath = './lib/esm-ext-mjs/index.mjs';

				test('Load', async () => {
					const nodeProcess = await node.load(importPath);
					expect(nodeProcess.stdout).toBe(output);
				});

				test('Import', async () => {
					const nodeProcess = await node.importDynamic(importPath);
					expect(nodeProcess.stdout).toBe(`${output}\n{"default":1234}`);
				});

				test('TypeScript Import', async () => {
					const nodeProcess = await node.importDynamic(importPath, { mode: 'typescript' });
					expect(nodeProcess.stdout).toBe(`${output}\n{"default":1234}`);
				});

				test('Require', async () => {
					const nodeProcess = await node.require(importPath);
					expect(nodeProcess.stdout).toBe(`${output}\n{"default":1234}`);
				});
			});

			describe('extensionless - should not work', ({ test }) => {
				const importPath = './lib/esm-ext-mjs/index';

				test('Load', async () => {
					const nodeProcess = await node.load(importPath);
					expect(nodeProcess.stderr).toMatch('Cannot find module');
				});

				test('Import', async () => {
					const nodeProcess = await node.importDynamic(importPath);
					expect(nodeProcess.stderr).toMatch('Cannot find module');
				});

				test('Require', async () => {
					const nodeProcess = await node.require(importPath);
					expect(nodeProcess.stderr).toMatch('Cannot find module');
				});
			});

			describe('directory - should not work', ({ test }) => {
				const importPath = './lib/esm-ext-mjs';

				test('Load', async () => {
					const nodeProcess = await node.load(importPath);
					expect(nodeProcess.stderr).toMatch('Cannot find module');
				});

				test('Import', async () => {
					const nodeProcess = await node.importDynamic(importPath);

					if (semver.satisfies(node.version, nodeSupports.import)) {
						expect(nodeProcess.stderr).toMatch('Directory import');
					} else {
						expect(nodeProcess.stderr).toMatch('Cannot find module');
					}
				});

				test('Require', async () => {
					const nodeProcess = await node.require(importPath);
					expect(nodeProcess.stderr).toMatch('Cannot find module');
				});
			});
		});

		describe('.js extension', ({ describe }) => {
			const output = 'loaded esm-ext-js/index.js {"nodePrefix":true,"hasDynamicImport":true,"nameInError":true,"sourceMap":true,"import.meta.url":true}';

			describe('full path', ({ test }) => {
				const importPath = './lib/esm-ext-js/index.js';

				test('Load', async () => {
					const nodeProcess = await node.load(importPath);
					expect(nodeProcess.stdout).toBe(output);
				});

				test('Import', async () => {
					const nodeProcess = await node.importDynamic(importPath);
					expect(nodeProcess.stdout).toBe(`${output}\n{"default":1234}`);
				});

				test('CommonJS Import', async () => {
					const nodeProcess = await node.importDynamic(importPath, { mode: 'commonjs' });
					expect(nodeProcess.stdout).toBe(`${output}\n{"default":1234}`);
				});

				test('Require', async () => {
					const nodeProcess = await node.require(importPath);
					expect(nodeProcess.stdout).toBe(`${output}\n{"default":1234}`);
				});
			});

			describe('extensionless', ({ test }) => {
				const importPath = './lib/esm-ext-js/index';

				test('Load', async () => {
					const nodeProcess = await node.load(importPath);
					expect(nodeProcess.stdout).toBe(output);
				});

				test('Import', async () => {
					const nodeProcess = await node.importDynamic(importPath);

					if (semver.satisfies(node.version, nodeSupports.import)) {
						expect(nodeProcess.stderr).toMatch('Cannot find module');
					} else {
						expect(nodeProcess.stdout).toBe(`${output}\n{"default":1234}`);
					}
				});

				test('Require', async () => {
					const nodeProcess = await node.require(importPath);
					expect(nodeProcess.stdout).toBe(`${output}\n{"default":1234}`);
				});
			});

			describe('directory', ({ test }) => {
				const importPath = './lib/esm-ext-js';

				test('Load', async () => {
					const nodeProcess = await node.load(importPath);
					expect(nodeProcess.stdout).toBe(output);
				});

				test('Import', async () => {
					const nodeProcess = await node.importDynamic(importPath);

					if (semver.satisfies(node.version, nodeSupports.import)) {
						expect(nodeProcess.stderr).toMatch('Directory import');
					} else {
						expect(nodeProcess.stdout).toBe(`${output}\n{"default":1234}`);
					}
				});

				test('Require', async () => {
					const nodeProcess = await node.require(importPath);
					expect(nodeProcess.stdout).toBe(`${output}\n{"default":1234}`);
				});
			});
		});
	});
});
