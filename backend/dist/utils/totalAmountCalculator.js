"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateOrderTotal = calculateOrderTotal;
// shared helper, e.g. in a utils file
function calculateOrderTotal(subtotal, tax, discount = 0) {
    const discountAmount = Number((((subtotal + tax) * discount) / 100).toFixed(2));
    return Number((subtotal + tax - discountAmount).toFixed(2));
}
