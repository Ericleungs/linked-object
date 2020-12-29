/**
 * Editor: Eric Leung
 * Created: 2020/12/25
 */

// constant definitions
const defaultObjectConfigs = { writable: true, enumerable: true, configurable: true }
const defaultProxyObject = {
  _value: null,
  _parent: null,
  _name: 'root',
  _function: null,
  _type: null,
  _link: ['root'],
}

// inner function definitions
/**
 * copy an array deeply by using recursion
 * @param { any } source Source array need to be copied
 * @return { any } a new target array
 */
let copyArray = (source) => {
  let temp = [];
  for (const i of source) {
    if (i instanceof Array) {
      temp.push(copyArray(i));
    }
    else {
      temp.push(i);
    }
  }
  return temp;
}

const linkObject = {
  /**
   * handler to resolve the target Object
   */
  handler: {
    /**
     * rewrite set method
     * @param { any } target target Object, root object generally
     * @param { any } propertyKey the key in object
     * @param { any } value the value for key
     * @param { any } receiver it is the 'this' of the object itself
     */
    set(target, propertyKey, value, receiver) {
      // use handler for recursion
      // however, handler can't be used directly in inner function
      // the fact is that handler become "this"
      // console.log(receiver);
      let handler = this;
      let parentNode = receiver;
      let selfNode = {
        _value: typeof value == 'function' ? undefined : value,
        _parent: parentNode,
        _name: propertyKey,
        _function: typeof value == 'function' ? value : undefined,
        _type: typeof value == 'function' ? 'function' : 'value',
        // IIFE
        _link: (() => {
          let linkList = [];
          let tempNode = receiver;
          // make link index dictionary
          while (tempNode._name) {
            linkList.push(tempNode._name);
            if (tempNode._parent) tempNode = tempNode._parent;
            else {
              linkList.reverse();
              linkList.push(propertyKey);
              break;
            }
          }
          return linkList;
        })(),
      }
      if (value != null) Reflect.set(target, propertyKey, new Proxy(selfNode, handler), receiver);
    },

    /**
     * rewrite get method
     * @param { any } target target Object, root object generally
     * @param { any } propertyKey the key need to be called
     * @param { any } receiver the minium caller
     */

    // ban getter temporarily
    /*
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
    */

    /**
     * rewrite effects from Object.defineProperty
     * @param {*} target 
     * @param {*} propertyKey 
     * @param {*} descriptor 
     */

    /*
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
    */
  },
  init() {
    let handler = this.handler;
    if (arguments.length == 0) return new Proxy(defaultProxyObject, handler);
    else return new Proxy(arguments, handler);
  }
}

// for Node.js
module.exports = linkObject;
// for Browser
// export default linkObject;
