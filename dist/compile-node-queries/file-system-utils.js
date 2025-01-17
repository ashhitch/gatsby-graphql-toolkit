"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeCompiledQueries = exports.writeGatsbyFragments = exports.readOrGenerateDefaultFragments = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const graphql_1 = require("graphql");
const generate_default_fragments_1 = require("./generate-default-fragments");
/**
 * Utility function that tries to load fragments from given path
 * and generates default fragments when some of the fragments do not exist
 */
async function readOrGenerateDefaultFragments(fragmentsDir, config) {
    const defaultFragments = (0, generate_default_fragments_1.generateDefaultFragments)(config);
    const result = new Map();
    await fs.ensureDir(fragmentsDir);
    for (const [remoteTypeName, fragment] of defaultFragments) {
        const fileName = path.join(fragmentsDir, `${remoteTypeName}.graphql`);
        let source;
        try {
            source = new graphql_1.Source(fs.readFileSync(fileName).toString(), fileName);
        }
        catch (e) {
            fs.writeFileSync(fileName, fragment);
            source = new graphql_1.Source(fragment, fileName);
        }
        result.set(remoteTypeName, source);
    }
    return result;
}
exports.readOrGenerateDefaultFragments = readOrGenerateDefaultFragments;
/**
 * Write the given fragments into a file the can be consumed by gatsby.
 *
 * @param fileName the name of javascript file to write the fragments to. can also include a path
 * @param fragmentsDoc the compiled gatsby fragments
 */
async function writeGatsbyFragments(fileName, fragmentsDoc) {
    await fs.ensureFile(fileName);
    const renderFragment = (def) => `
export const ${def.name.value} = graphql\`
  ${(0, graphql_1.print)(def)}
\``;
    const text = `/* eslint-disable */
/**
 * This file was generated by gatsby-graphql-toolkit.
 */
import { graphql } from "gatsby"
${fragmentsDoc.definitions.map(renderFragment).join(`\n\n`)}
`;
    await fs.writeFile(fileName, text);
}
exports.writeGatsbyFragments = writeGatsbyFragments;
async function writeCompiledQueries(outputDir, compiledQueries) {
    await fs.ensureDir(outputDir);
    for (const [remoteTypeName, document] of compiledQueries) {
        await fs.writeFile(outputDir + `/${remoteTypeName}.graphql`, (0, graphql_1.print)(document));
    }
}
exports.writeCompiledQueries = writeCompiledQueries;
//# sourceMappingURL=file-system-utils.js.map