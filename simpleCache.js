var cacheTable = {}

function get(key) {
	return cacheTable[key];
}

function put(key, value) {
	cacheTable[key] = value;
}