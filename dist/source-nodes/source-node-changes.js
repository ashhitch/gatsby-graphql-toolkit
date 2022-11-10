"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourceNodeChanges = void 0;
const touch_nodes_1 = require("./node-actions/touch-nodes");
const fetch_nodes_1 = require("./fetch-nodes/fetch-nodes");
const create_nodes_1 = require("./node-actions/create-nodes");
const delete_nodes_1 = require("./node-actions/delete-nodes");
const sourcing_context_1 = require("./sourcing-context");
/**
 * Uses sourcing config and a list of node change events (delta) to
 * delete nodes that no longer exist in the remote API and re-fetch
 * individual nodes that were updated in the remote API
 * since the last Gatsby build.
 */
async function sourceNodeChanges(config, delta) {
    const context = (0, sourcing_context_1.createSourcingContext)(config);
    const { updates, deletes } = groupChanges(delta);
    const promises = [];
    await (0, touch_nodes_1.touchNodes)(context);
    for (const [remoteTypeName, ids] of updates) {
        const nodes = (0, fetch_nodes_1.fetchNonNullishNodesById)(context, remoteTypeName, ids);
        const promise = (0, create_nodes_1.createNodes)(context, remoteTypeName, nodes);
        promises.push(promise);
    }
    await (0, delete_nodes_1.deleteNodes)(context, deletes);
    await Promise.all(promises);
}
exports.sourceNodeChanges = sourceNodeChanges;
function groupChanges(delta) {
    const updates = new Map();
    const deletes = [];
    delta.nodeEvents.forEach(event => {
        var _a;
        if (event.eventName === "UPDATE") {
            const tmp = (_a = updates.get(event.remoteTypeName)) !== null && _a !== void 0 ? _a : [];
            tmp.push(event.remoteId);
            updates.set(event.remoteTypeName, tmp);
        }
        if (event.eventName === "DELETE") {
            deletes.push(event);
        }
    });
    return { updates, deletes };
}
//# sourceMappingURL=source-node-changes.js.map