import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cn } from "./utils.ts";

describe("cn function", () => {
    test("combines basic string classes", () => {
        assert.equal(cn("class1", "class2"), "class1 class2");
    });

    test("handles conditional classes", () => {
        assert.equal(
            cn("class1", { class2: true, class3: false }),
            "class1 class2"
        );
    });

    test("handles array inputs", () => {
        assert.equal(cn(["class1", "class2"], "class3"), "class1 class2 class3");
    });

    test("handles falsy values", () => {
        assert.equal(
            cn("class1", null, undefined, false, 0, "", "class2"),
            "class1 class2"
        );
    });

    test("resolves Tailwind CSS conflicts", () => {
        // tailwind-merge should resolve these by picking the last class
        assert.equal(cn("p-4", "p-8"), "p-8");
        assert.equal(cn("bg-red-500", "bg-blue-500"), "bg-blue-500");
        assert.equal(cn("text-sm", "text-lg"), "text-lg");
    });

    test("combines conditional classes and resolves conflicts", () => {
        assert.equal(
            cn("p-4 bg-red-500", { "p-8": true, "bg-blue-500": false }),
            "bg-red-500 p-8"
        );
    });
});
