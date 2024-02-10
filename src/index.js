export { stringify } from './stringify.js';
import { KeyValue } from './keyvalue.js';
export { KeyValue };

const TOKEN_OPENING_BRACE = 1;
const TOKEN_CLOSING_BRACE = 2;
const TOKEN_NEW_LINE = 3;
const TOKEN_STRING_VALUE = 4;
const TOKEN_END = 5;

export function parse(source) {
	const reader = {
		s: source,
		offset: 0,
		len: source.length,
	};

	const stringStack = [];
	const levelStack = [];

	let currentLevel = new KeyValue('root', []);
	let result;

TokenLoop:
	while (true) {
		const [token, s] = getNextToken(reader);
		switch (token) {
			case TOKEN_OPENING_BRACE:
				const subLevel = new KeyValue(stringStack.pop(), []);

				if (currentLevel) {
					currentLevel.value.push(subLevel);
				}

				levelStack.push(currentLevel);
				currentLevel = subLevel;
				break;
			case TOKEN_CLOSING_BRACE:
				currentLevel = levelStack.pop();
				if (currentLevel) {
					result = currentLevel;
				}
				break;
			case TOKEN_STRING_VALUE:
				stringStack.push(s);
				//fallthrough
			case TOKEN_NEW_LINE:
				if (stringStack.length > 1) {
					const value = stringStack.pop();
 					const key = stringStack.pop()
					currentLevel.value.push(new KeyValue(key, value));
				}
				break;
				break;
			case TOKEN_END:
				break TokenLoop;
		}
	}

	return result;
}

function getNextRune(reader) {
	return reader.s[reader.offset++];
}

function getNextToken(reader) {
	while (reader.offset < reader.len) {
		const c = getNextRune(reader);
		switch (c) {
			case '{':
				return [TOKEN_OPENING_BRACE];
			case '}':
				return [TOKEN_CLOSING_BRACE];
			case '\r':
			case '\n':
				return [TOKEN_NEW_LINE];
			case ' ':
			case '\t':
				//just eat a char
				break;
			case '"':
				let s = "";
				while (reader.offset < reader.len) {
					const c = getNextRune(reader);
					switch (c) {
						case '\\':
							if (reader.offset < reader.len) {
								const c = getNextRune(reader);
								if (c == '"') {
									s += '\\"'
								} else {
									s += '\\' + c;
								}
							}
						case '"':
							return [TOKEN_STRING_VALUE, s];
						default:
							s += c;
					}
				}
				break;
			case '/':
				while (reader.offset < reader.len) {
					const c = getNextRune(reader);
					if (c == '\r' || c == '\n') {
						break;
					}
				}
				break;
			default:
				// unquoted string
				let unquoted = c;
				while (reader.offset < reader.len) {
					const c = getNextRune(reader);
					switch (c) {
						case '"':
						case '\'':
							throw "Quote in an unquoted string";
						case '{':
						case '}':
							// Get back one character
							--reader.offset;
							//fallthrough
						case ' ':
						case '\t':
						case '\r':
						case '\n':
							return [TOKEN_STRING_VALUE, unquoted];
						default:
							unquoted += c;
					}
				}
				break;
		}
	}
	return [TOKEN_END]
}
