// \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __exportAll = (all, flags) => {
	let target = Object.setPrototypeOf({}, null);
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!(flags & 1)) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return flags & 2 ? target : Object.preventExtensions(target);
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
export { __exportAll, __reExport };
