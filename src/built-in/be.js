/**
* Throws error based on identity comparison.
* @param {*} criterion
* @return {Promise}
*/
export default {
  name: 'be',
  fn: function () {
    return this.actual === this.expected;
  }
};
