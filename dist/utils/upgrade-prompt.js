"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upgradeToV03 = exports.promptUpgradeIfRequired = void 0;
const chalk_1 = __importDefault(require("chalk"));
function promptUpgradeIfRequired(nodeTypes) {
    for (const def of nodeTypes) {
        // @ts-ignore
        if (def.remoteIdFields) {
            upgradeToV03();
        }
    }
}
exports.promptUpgradeIfRequired = promptUpgradeIfRequired;
function upgradeToV03() {
    console.error(`${chalk_1.default.white.bgRed(` gatsby-graphql-source-toolkit `)} ` +
        `Starting with version 0.3 the toolkit uses a new format to define "remoteIdFields". ` +
        `Please upgrade using the link below\n\n` +
        `https://github.com/vladar/gatsby-graphql-toolkit/blob/master/CHANGELOG.md#v030`);
    process.exit(1);
}
exports.upgradeToV03 = upgradeToV03;
//# sourceMappingURL=upgrade-prompt.js.map