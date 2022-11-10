"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printFragment = exports.printQuery = exports.dedent = exports.gatsbyApi = exports.createGatsbyNodeDefinitions = void 0;
var create_node_definitions_1 = require("./create-node-definitions");
Object.defineProperty(exports, "createGatsbyNodeDefinitions", { enumerable: true, get: function () { return create_node_definitions_1.createGatsbyNodeDefinitions; } });
var gatsby_api_1 = require("./gatsby-api");
Object.defineProperty(exports, "gatsbyApi", { enumerable: true, get: function () { return gatsby_api_1.gatsbyApi; } });
var print_1 = require("./print");
Object.defineProperty(exports, "dedent", { enumerable: true, get: function () { return print_1.dedent; } });
Object.defineProperty(exports, "printQuery", { enumerable: true, get: function () { return print_1.printQuery; } });
Object.defineProperty(exports, "printFragment", { enumerable: true, get: function () { return print_1.printFragment; } });
//# sourceMappingURL=index.js.map