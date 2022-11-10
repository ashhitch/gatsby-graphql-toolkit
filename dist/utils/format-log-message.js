"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLogMessage = void 0;
function formatLogMessage(input) {
    let message;
    if (typeof input === `string`) {
        message = input;
    }
    else {
        message = input[0];
    }
    return message;
}
exports.formatLogMessage = formatLogMessage;
//# sourceMappingURL=format-log-message.js.map