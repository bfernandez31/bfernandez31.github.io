import { describe, expect, test } from "bun:test";

/**
 * Example Test Suite
 *
 * This file demonstrates the test structure using Bun's built-in test runner.
 * Bun test runner uses a Jest-compatible API with describe, test, and expect.
 *
 * Run tests: bun test
 * Watch mode: bun test --watch
 * Coverage: bun test --coverage
 */

describe("Example Test Suite", () => {
	test("basic arithmetic operations work correctly", () => {
		expect(2 + 2).toBe(4);
		expect(10 - 5).toBe(5);
		expect(3 * 4).toBe(12);
		expect(15 / 3).toBe(5);
	});

	test("string operations work correctly", () => {
		const greeting = "Hello, World!";
		expect(greeting).toContain("World");
		expect(greeting.length).toBe(13);
		expect(greeting.toLowerCase()).toBe("hello, world!");
	});

	test("array operations work correctly", () => {
		const numbers = [1, 2, 3, 4, 5];
		expect(numbers).toHaveLength(5);
		expect(numbers).toContain(3);
		expect(numbers[0]).toBe(1);
		expect(numbers[numbers.length - 1]).toBe(5);
	});

	test("object operations work correctly", () => {
		const user = {
			name: "Test User",
			age: 30,
			email: "test@example.com",
		};

		expect(user).toHaveProperty("name");
		expect(user.name).toBe("Test User");
		expect(user.age).toBeGreaterThan(18);
	});

	test("boolean operations work correctly", () => {
		expect(true).toBe(true);
		expect(false).toBe(false);
		expect(true && true).toBe(true);
		expect(true || false).toBe(true);
		expect(!false).toBe(true);
	});

	test("null and undefined handling", () => {
		const nullValue = null;
		const undefinedValue = undefined;

		expect(nullValue).toBeNull();
		expect(undefinedValue).toBeUndefined();
		expect(nullValue).not.toBeUndefined();
		expect(undefinedValue).not.toBeNull();
	});

	test("async operations work correctly", async () => {
		const promise = Promise.resolve("resolved value");
		await expect(promise).resolves.toBe("resolved value");

		const asyncFunction = async () => {
			return "async result";
		};

		expect(await asyncFunction()).toBe("async result");
	});

	test("error handling works correctly", () => {
		const throwError = () => {
			throw new Error("Test error");
		};

		expect(throwError).toThrow();
		expect(throwError).toThrow("Test error");
	});
});

describe("TypeScript Type Safety", () => {
	test("TypeScript types are enforced", () => {
		interface User {
			id: number;
			name: string;
			email: string;
		}

		const user: User = {
			id: 1,
			name: "John Doe",
			email: "john@example.com",
		};

		expect(user.id).toBeTypeOf("number");
		expect(user.name).toBeTypeOf("string");
		expect(user.email).toBeTypeOf("string");
	});

	test("type guards work correctly", () => {
		const isString = (value: unknown): value is string => {
			return typeof value === "string";
		};

		expect(isString("hello")).toBe(true);
		expect(isString(123)).toBe(false);
		expect(isString(null)).toBe(false);
	});
});

describe("Performance Considerations", () => {
	test("operations complete in reasonable time", () => {
		const startTime = performance.now();

		// Simulate some work
		let sum = 0;
		for (let i = 0; i < 10000; i++) {
			sum += i;
		}

		const endTime = performance.now();
		const duration = endTime - startTime;

		// Should complete in less than 100ms
		expect(duration).toBeLessThan(100);
		expect(sum).toBe(49995000);
	});
});
