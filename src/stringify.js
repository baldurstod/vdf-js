
export function stringify(kv, options = {}) {
	let buffer = '';

	let tabs = '';

	let objectStack = [];
	for (let i = kv.value.length - 1; i >= 0; --i) {
		objectStack.push(kv.value[i]);
	}

	let currentEntity = objectStack.pop();
	while (currentEntity) {
		if (currentEntity === true) {
			tabs = tabs.slice(0, -1);
			buffer += `${tabs}}\n`;
		} else {
			const value = currentEntity.value;
			if (Array.isArray(value)) {
				// sub object

				buffer += `${tabs}${currentEntity.key}\n${tabs}{\n`;
				tabs += '\t';

				// We push true to indicate end of an object
				objectStack.push(true);

				// We are iterating in reverse order cause our stack is LIFO
				for (let i = value.length - 1; i >= 0; --i) {
					objectStack.push(value[i]);
				}
			} else {
				// primitive value
				buffer += `${tabs}${currentEntity.key} ${currentEntity.value}\n`;

			}
		}
		currentEntity = objectStack.pop();
	}

	return buffer;
}
