const AsyncFunction = (async () => {}).constructor;
const GeneratorFunction = function * () {}.constructor;

module.exports.isAsync = function (fn) { return (fn instanceof AsyncFunction && AsyncFunction !== Function && AsyncFunction !== GeneratorFunction) === true; };
