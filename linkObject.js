/**
 * Editor: Eric Leung
 * Created: 2020/12/25
 */

// constant definitions
const defaultObjectConfigs = { writable: true, enumerable: true, configurable: true }
const defaultProxyObject = { _value: null, _parent: null, _name: 'root', _function: null, _type: null }

const linkObject = {
  /**
   * handler to resolve the target Object
   */
  handler: {
    /**
     * rewrite set method
     * @param { any } target the Object need to be set
     * @param { any } propertyKey the key in object
     * @param { any } value the value for key
     * @param { any } receiver it is the 'this' of the object itself
     */
    set(target, propertyKey, value, receiver) {
      let parentNode = receiver;
      let selfNode = {
        _value: typeof value == 'function' ? undefined : value,
        _parent: parentNode,
        _name: propertyKey,
        _function: typeof value == 'function' ? value : undefined,
        _type: typeof value == 'function' ? 'function' : 'value'
      }
      if (value != null) Reflect.set(target, propertyKey, new Proxy(selfNode, handler), receiver);
    },

    /**
     * rewrite get method
     * @param { any } target target Object, root object generally
     * @param { any } propertyKey the key need to be called
     * @param { any } receiver the minium caller
     */
    get(target, propertyKey) {
      let excluded = ['_parent', '_name', '_value', '_function', '_type'];
      let callExcluded = true;
      // Exclude the inner property key
      for (const i of excluded) {
        if (propertyKey == i) {
          callExcluded = false;
          break;
        }
      }
      if (callExcluded) return target[propertyKey]['_value'] ?
        target[propertyKey]['_value'] : target[propertyKey]['_function'];
      else return target[propertyKey];
    },

    /**
     * 
     * @param {*} target 
     * @param {*} propertyKey 
     * @param {*} descriptor 
     */
    defineProperty(target, propertyKey, descriptor) {
      try {
        let value = descriptor.value;
        Reflect.defineProperty(target, propertyKey, {
          value: {
            _value: typeof value == 'function' ? undefined : value,
            _parent: parentNode,
            _name: propertyKey,
            _function: typeof value == 'function' ? value : undefined,
            _type: typeof value == 'function' ? 'function' : 'value'
          }, ...defaultObjectConfigs
        });
      } catch (e) {
        console.warn("defineProperty applies Error\n Error due to wrong parameters");
        return false;
      }
      return true;
    }
  },
  /**
   * create a Object with object links
   * @param  {...any} sourceObject (Optional) target Object
   */
  newObject(...sourceObject) {
    if (!sourceObject) return new Proxy(defaultProxyObject, handler);
    else return new Proxy(sourceObject, handler);
  }
}

try {
  module.exports = linkObject;
} catch (error) {
  console.log(error);
  export default linkObject;
}
