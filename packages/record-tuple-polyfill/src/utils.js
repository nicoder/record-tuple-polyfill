/*
 ** Copyright 2020 Bloomberg Finance L.P.
 **
 ** Licensed under the Apache License, Version 2.0 (the "License");
 ** you may not use this file except in compliance with the License.
 ** You may obtain a copy of the License at
 **
 **     http://www.apache.org/licenses/LICENSE-2.0
 **
 ** Unless required by applicable law or agreed to in writing, software
 ** distributed under the License is distributed on an "AS IS" BASIS,
 ** WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ** See the License for the specific language governing permissions and
 ** limitations under the License.
 */

export function isObject(v) {
    return typeof v === "object" && v !== null;
}
export function isFunction(v) {
    return typeof v === "function";
}

export function isIterableObject(v) {
    return isObject(v) && typeof v[Symbol.iterator] === "function";
}

export function objectFromEntries(iterable) {
    return [...iterable].reduce((obj, [key, val]) => {
        obj[key] = val;
        return obj;
    }, {});
}

export function unbox(v) {
    if (v instanceof Boolean) {
        return Boolean.prototype.valueOf.call(v);
    } else if (v instanceof Number) {
        return Number.prototype.valueOf.call(v);
    } else if ("BigInt" in globalThis && v instanceof globalThis["BigInt"]) {
        return globalThis["BigInt"].prototype.valueOf.call(v);
    } else if (v instanceof String) {
        return String.prototype.valueOf.call(v);
    } else if (v instanceof Symbol) {
        return Symbol.prototype.valueOf.call(v);
    } else {
        return v;
    }
}

const RECORD_WEAKMAP = new WeakMap();
const TUPLE_WEAKMAP = new WeakMap();
export function isRecord(value) {
    return RECORD_WEAKMAP.has(value);
}
export function isTuple(value) {
    return TUPLE_WEAKMAP.has(value);
}
export function markRecord(value) {
    RECORD_WEAKMAP.set(value, true);
}
export function markTuple(value) {
    TUPLE_WEAKMAP.set(value, true);
}

function isRecordOrTuple(value) {
    return isRecord(value) || isTuple(value);
}
export function validateProperty(value) {
    const unboxed = unbox(value);
    if (isObject(unboxed) && !isRecordOrTuple(unboxed)) {
        throw new Error(
            "TypeError: cannot use an object as a value in a record",
        );
    } else if (isFunction(unboxed)) {
        throw new Error(
            "TypeError: cannot use a function as a value in a record",
        );
    }
    return unboxed;
}
