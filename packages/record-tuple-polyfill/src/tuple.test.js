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

import { Record, Tuple } from "./index";

test("Tuple creates an tuple with the provides arguments as elements", () => {
    expect(Tuple(1, 2, 3)).toBe(Tuple(1, 2, 3));

    const sym = Symbol();
    expect(Tuple(true, false, "test", sym, null, undefined)).toBe(
        Tuple(true, false, "test", sym, null, undefined),
    );

    expect(Tuple(1, 2, Tuple(3, 4))).toBe(Tuple(1, 2, Tuple(3, 4)));
});

test("tuples cannot contain objects", () => {
    expect(() => Tuple([])).toThrow();
    expect(() => Tuple({})).toThrow();
    expect(() => Tuple(function() {})).toThrow();
});

test("tuples unbox boxed primitives", () => {
    expect(Tuple(Object(true))).toBe(Tuple(true));
    expect(Tuple(Object(1))).toBe(Tuple(1));
    expect(Tuple(Object("test"))).toBe(Tuple("test"));

    const sym = Symbol();
    expect(Tuple(Object(sym))).toBe(Tuple(sym));
});

test("tuples are correctly identified as tuples", () => {
    expect(Tuple.isTuple(Tuple(1, 2, 3))).toBe(true);
    expect(Tuple.isTuple(Record({ a: 1 }))).toBe(false);
    expect(Tuple.isTuple({ a: 1 })).toBe(false);
    expect(Tuple.isTuple(function() {})).toBe(false);
    expect(Tuple.isTuple(true)).toBe(false);
    expect(Tuple.isTuple(1)).toBe(false);
    expect(Tuple.isTuple("test")).toBe(false);
    expect(Tuple.isTuple(Symbol())).toBe(false);
});

test("Tuple function creates frozen objects with a non-{enumerable/configurable/writable} length property", () => {
    expect(Object.isFrozen(Tuple(1, 2, 3))).toBe(true);

    expect(Object.getOwnPropertyDescriptor(Tuple(1, 2, 3), "length")).toEqual({
        configurable: false,
        enumerable: false,
        value: 3,
        writable: false,
    });

    expect(Object.isFrozen(Tuple(1, 2, Tuple(3))[2])).toBe(true);
});
test("Tuples are iterable", () => {
    expect(Array.from(Tuple(1, 2, 3))).toEqual([1, 2, 3]);

    const tuple = Tuple(1, 2, 3);
    const iterator = tuple[Symbol.iterator]();

    expect(iterator.next()).toEqual({ value: 1, done: false });
    expect(iterator.next()).toEqual({ value: 2, done: false });
    expect(iterator.next()).toEqual({ value: 3, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: true });
});

test("tuples with the same structural equality will be equal", () => {
    expect(Tuple(1, 2, 3)).toBe(Tuple(1, 2, 3));
    expect(Tuple(1, 2, Tuple(4, 5))).toBe(Tuple(1, 2, Tuple(4, 5)));

    expect(Tuple(1, 2, 3)).not.toBe(Tuple(4, 5, 6));
});

test("Tuple equality handles -/+0 and NaN correctly", () => {
    expect(Tuple(-0)).toBe(Tuple(-0));
    expect(Tuple(+0)).toBe(Tuple(+0));
    expect(Tuple(-0)).toBe(Tuple(+0));
    expect(Tuple(+0)).toBe(Tuple(-0));
    expect(Tuple(NaN)).toBe(Tuple(NaN));
});

test("Tuple.from", () => {
    expect(Tuple.from([1, 2, 3])).toBe(Tuple(1, 2, 3));
    expect(Tuple.from([1, 2, 3], v => v + 1)).toBe(Tuple(2, 3, 4));

    // ensure that thisArg is correctly used for the mapFn
    const rec = Record({ a: 1 });
    expect(
        Tuple.from(
            [1],
            function() {
                return this;
            },
            rec,
        )[0],
    ).toBe(rec);
});
test("Tuple.of", () => {
    expect(Tuple.of(1, 2, 3)).toBe(Tuple(1, 2, 3));
});

test("Tuple.prototype.toString", () => {
    expect(Tuple(1, 2, 3).toString()).toEqual("[tuple Tuple]");
});

test("Tuple.prototype.popped", () => {
    expect(Tuple().popped()).toBe(Tuple());
    expect(Tuple(1).popped()).toBe(Tuple());
    expect(Tuple(1, 2, 3).popped()).toBe(Tuple(1, 2));
});
test("Tuple.prototype.pushed", () => {
    expect(Tuple().pushed()).toBe(Tuple());
    expect(Tuple().pushed(undefined)).toBe(Tuple(undefined));
    expect(Tuple().pushed(1, 2, 3)).toBe(Tuple(1, 2, 3));
    expect(Tuple(1, 2, 3).pushed(4, 5, 6)).toBe(Tuple(1, 2, 3, 4, 5, 6));
});
// TODO: Tuple prototype methods
