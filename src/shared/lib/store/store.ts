type Listener<State> = (state: State) => void;

export class Store<State> {
	public state: State;

	private listeners: Set<Listener<State>>;

	constructor(state: State) {
		this.state = state;
		this.listeners = new Set();
	}

	/**
	 * Registers a listener that will be called whenever the store's state changes.
	 *
	 * @param fn The listener function to be called on state changes.
	 * @returns A function to unsubscribe the listener.
	 */
	public subscribe = (fn: Listener<State>) => {
		this.listeners.add(fn);

		return () => {
			this.listeners.delete(fn);
		};
	};

	/**
	 * Returns the current state of the store.
	 */
	public getSnapshot = () => {
		return this.state;
	};

	/**
	 * Updates the entire store's state and notifies all registered listeners.
	 *
	 * @param newState The new state to set for the store.
	 */
	public update = (newState: State) => {
		if (this.state !== newState) {
			this.state = newState;
			this.listeners.forEach(listener => listener(newState));
		}
	};

	/**
	 * Merges the provided changes into the current state and notifies listeners if there are changes.
	 *
	 * @param changes An object containing the changes to apply to the current state.
	 */
	public apply = (changes: Partial<State>) => {
		for (const key in changes) {
			if (!Object.is(changes[key], this.state[key])) {
				this.update({ ...this.state, ...changes });
				return;
			}
		}
	};

	/**
	 * Sets a specific key in the store's state to a new value and notifies listeners if the value has changed.
	 *
	 * @param key The key in the store's state to update.
	 * @param value The new value to set for the specified key.
	 */
	public set = <T>(key: keyof State, value: T) => {
		if (!Object.is(this.state[key], value)) {
			return this.update({ ...this.state, [key]: value });
		}
	};
}

