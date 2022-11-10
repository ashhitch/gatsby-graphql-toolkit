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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationAdapters = exports.NoPagination = exports.RelayForward = exports.LimitOffset = void 0;
const limit_offset_1 = require("./limit-offset");
Object.defineProperty(exports, "LimitOffset", { enumerable: true, get: function () { return limit_offset_1.LimitOffset; } });
const relay_1 = require("./relay");
Object.defineProperty(exports, "RelayForward", { enumerable: true, get: function () { return relay_1.RelayForward; } });
const no_pagination_1 = require("./no-pagination");
Object.defineProperty(exports, "NoPagination", { enumerable: true, get: function () { return no_pagination_1.NoPagination; } });
__exportStar(require("./types"), exports);
const PaginationAdapters = [no_pagination_1.NoPagination, limit_offset_1.LimitOffset, relay_1.RelayForward];
exports.PaginationAdapters = PaginationAdapters;
//# sourceMappingURL=index.js.map