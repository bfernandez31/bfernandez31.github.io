/**
 * Lazy Loader Utility
 * Feature: 011-1522-fix-project (Phase 6 - User Story 4)
 *
 * Priority-based lazy loading system for non-critical components.
 * Uses Intersection Observer, idle callbacks, and timeouts to defer loading.
 */

/**
 * Priority levels for lazy loading (lower number = higher priority)
 */
export enum LazyLoadPriority {
	IMMEDIATE = 0, // Load immediately (hero, main nav)
	HIGH = 1, // Load when user scrolls (scroll progress)
	MEDIUM = 2, // Load when user scrolls past hero (nav dots)
	LOW = 3, // Load after idle timeout (cursor effects)
}

/**
 * Trigger types for lazy loading
 */
export type LazyLoadTrigger = "intersection" | "scroll" | "idle" | "timeout";

/**
 * Options for lazy loading tasks
 */
export interface LazyLoadOptions {
	trigger: LazyLoadTrigger;
	observerOptions?: IntersectionObserverInit;
	timeout?: number; // Timeout in milliseconds
	target?: string | Element; // Target element selector or element (for intersection observer)
}

/**
 * Lazy load task definition
 */
export interface LazyLoadTask {
	id: string;
	priority: LazyLoadPriority;
	loader: () => Promise<void>;
	options: LazyLoadOptions;
	isLoaded: boolean;
	isLoading: boolean;
	error: Error | null;
}

/**
 * Lazy Load Queue Manager
 */
class LazyLoadQueueManager {
	private tasks: Map<string, LazyLoadTask> = new Map();
	private observers: Map<string, IntersectionObserver> = new Map();
	private scrollHandler: (() => void) | null = null;

	/**
	 * Enqueue a lazy load task
	 */
	enqueue(task: LazyLoadTask): void {
		if (this.tasks.has(task.id)) {
			console.warn(`[LazyLoader] Task ${task.id} already enqueued`);
			return;
		}

		this.tasks.set(task.id, task);

		// Start loading based on trigger type
		this.startLoading(task);

		console.log(
			`[LazyLoader] Enqueued task: ${task.id} (priority: ${task.priority}, trigger: ${task.options.trigger})`,
		);
	}

	/**
	 * Start loading a task based on its trigger type
	 */
	private startLoading(task: LazyLoadTask): void {
		const { trigger, target, observerOptions, timeout } = task.options;

		switch (trigger) {
			case "intersection": {
				if (!target) {
					console.error(`[LazyLoader] No target specified for intersection trigger (task: ${task.id})`);
					return;
				}

				const targetElement =
					typeof target === "string"
						? document.querySelector(target)
						: target;

				if (!targetElement) {
					console.warn(
						`[LazyLoader] Target element not found for task ${task.id}`,
					);
					return;
				}

				const observer = new IntersectionObserver((entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) {
							this.load(task.id);
							observer.disconnect();
							this.observers.delete(task.id);
						}
					}
				}, observerOptions);

				observer.observe(targetElement);
				this.observers.set(task.id, observer);
				break;
			}

			case "scroll": {
				if (!this.scrollHandler) {
					this.scrollHandler = () => {
						// Load all scroll-triggered tasks on first scroll
						for (const [id, t] of this.tasks) {
							if (t.options.trigger === "scroll" && !t.isLoaded && !t.isLoading) {
								this.load(id);
							}
						}

						// Remove scroll listener after first scroll
						window.removeEventListener("scroll", this.scrollHandler!);
						this.scrollHandler = null;
					};

					window.addEventListener("scroll", this.scrollHandler, {
						once: true,
						passive: true,
					});
				}
				break;
			}

			case "idle": {
				const idleTimeout = timeout ?? 2000;

				if ("requestIdleCallback" in window) {
					(window as Window & typeof globalThis).requestIdleCallback(() => {
						this.load(task.id);
					});
				} else {
					// Fallback for browsers without requestIdleCallback
					setTimeout(() => {
						this.load(task.id);
					}, idleTimeout);
				}
				break;
			}

			case "timeout": {
				const delay = timeout ?? 1000;
				setTimeout(() => {
					this.load(task.id);
				}, delay);
				break;
			}
		}
	}

	/**
	 * Load a task by ID
	 */
	async load(id: string): Promise<void> {
		const task = this.tasks.get(id);

		if (!task) {
			console.warn(`[LazyLoader] Task ${id} not found`);
			return;
		}

		if (task.isLoaded) {
			console.log(`[LazyLoader] Task ${id} already loaded`);
			return;
		}

		if (task.isLoading) {
			console.log(`[LazyLoader] Task ${id} is already loading`);
			return;
		}

		task.isLoading = true;
		console.log(`[LazyLoader] Loading task: ${id}`);

		try {
			await task.loader();
			task.isLoaded = true;
			task.isLoading = false;
			task.error = null;
			console.log(`[LazyLoader] Successfully loaded task: ${id}`);
		} catch (error) {
			task.isLoading = false;
			task.error = error as Error;
			console.error(`[LazyLoader] Failed to load task ${id}:`, error);

			// Site remains functional - lazy-loaded components are optional
			// Error is logged but not thrown to prevent breaking the page
		}
	}

	/**
	 * Load all tasks of a specific priority
	 */
	async loadByPriority(priority: LazyLoadPriority): Promise<void[]> {
		const promises: Promise<void>[] = [];

		for (const [id, task] of this.tasks) {
			if (task.priority === priority && !task.isLoaded && !task.isLoading) {
				promises.push(this.load(id));
			}
		}

		return Promise.all(promises);
	}

	/**
	 * Check if a task is loaded
	 */
	isLoaded(id: string): boolean {
		return this.tasks.get(id)?.isLoaded ?? false;
	}

	/**
	 * Cancel all observers and clear queue
	 */
	cancelAll(): void {
		// Disconnect all intersection observers
		for (const observer of this.observers.values()) {
			observer.disconnect();
		}
		this.observers.clear();

		// Remove scroll listener if active
		if (this.scrollHandler) {
			window.removeEventListener("scroll", this.scrollHandler);
			this.scrollHandler = null;
		}

		// Clear tasks
		this.tasks.clear();

		console.log("[LazyLoader] All tasks cancelled");
	}

	/**
	 * Get task status for debugging
	 */
	getStatus(): {
		total: number;
		loaded: number;
		loading: number;
		failed: number;
	} {
		let loaded = 0;
		let loading = 0;
		let failed = 0;

		for (const task of this.tasks.values()) {
			if (task.isLoaded) loaded++;
			else if (task.isLoading) loading++;
			else if (task.error) failed++;
		}

		return {
			total: this.tasks.size,
			loaded,
			loading,
			failed,
		};
	}
}

/**
 * Singleton instance of the lazy load queue manager
 */
export const lazyLoadQueue = new LazyLoadQueueManager();

/**
 * Helper function to create and enqueue a lazy load task
 */
export function lazyLoad(
	id: string,
	loader: () => Promise<void>,
	priority: LazyLoadPriority,
	options: LazyLoadOptions,
): void {
	lazyLoadQueue.enqueue({
		id,
		priority,
		loader,
		options,
		isLoaded: false,
		isLoading: false,
		error: null,
	});
}

/**
 * Helper function to create a dynamic import loader
 * Enables code splitting for lazy-loaded components
 */
export function createDynamicImportLoader(
	importFn: () => Promise<{ default?: () => void; [key: string]: any }>,
	initFnName?: string,
): () => Promise<void> {
	return async () => {
		try {
			const module = await importFn();

			// If an init function name is provided, call it
			if (initFnName && typeof module[initFnName] === "function") {
				module[initFnName]();
			}
			// Otherwise, call the default export if it's a function
			else if (typeof module.default === "function") {
				module.default();
			}
		} catch (error) {
			console.error("[LazyLoader] Failed to load dynamic import:", error);
			throw error; // Re-throw to let the task handle the error
		}
	};
}
