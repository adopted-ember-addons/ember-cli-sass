/* eslint-env node */
module.exports = {
  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall(options) {
    return this.addPackageToProject('sass');
  }
};
