/**
 * This allows us to not have to use relative paths for import.
 * See https://coderwall.com/p/th6ssq
 */

global.base_dir = __dirname;
global.absPath = function(path) {
  return base_dir + path;
};
global.include = function(file) {
  return require(absPath('/' + file));
};
