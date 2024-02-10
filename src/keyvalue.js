export class KeyValue {
	constructor(key, value) {
		this.key = key;
		this.value = value;
	}

	getKeyByName(key) {
		if (Array.isArray(this.value)) {
			for (let subValue of this.value) {
				if (subValue.key == key) {
					return subValue;
				}
			}
		}
		return null;
	}

	getKeysByName(key) {
		if (Array.isArray(this.value)) {
			const res = [];
			for (let subValue of this.value) {
				if (subValue.key == key) {
					res.push(subValue);
				}
			}
			return res;
		}
		return null;
	}

	getKeys() {
		if (Array.isArray(this.value)) {
			const res = [];
			for (let subValue of this.value) {
				res.push(subValue);
			}
			return res;
		}
		return null;
	}
}
