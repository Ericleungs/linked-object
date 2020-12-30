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
const attributeList = ['_value', '_parent', '_name', '_function', '_type', '_link'];

// inner function definitions
/**
 * copy an array deeply by using recursion
 * @param { any } source Source array need to be copied
 * @return { any } a new target array
 */
let _copyArray = (source) => {
  let temp = [];
  for (const i of source) {
    if (i instanceof Array) {
      temp.push(_copyArray(i));
    }
    else {
      temp.push(i);
    }
  }
  return temp;
}

let _makeLinkList = (target, propertyKey, receiver) => {
  // target seems redundant
  // but it can't be removed because it will be illegal in JS language style
  let linkList = [];
  let tempNode = receiver;
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

    // setter is banned
    // because handler.defineProperty can replace setter
    /*
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
        _link: _makeLinkList(target, propertyKey, receiver),
      }
      if (value != null) {
        Reflect.set(target, propertyKey, new Proxy(selfNode, handler), receiver);
        return true;
      }
      if (attributeList.includes(propertyKey)) {
        console.warn(`the key ${propertyKey} is conflict with inner key`);
        return false;
      }
    },
    */

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
     * rewrite Object.defineProperty method
     * CAUTIONS: it will redefine all setters in this Object
     */
    defineProperty(target, propertyKey, descriptor) {
      let handler = this;
      if (attributeList.includes(propertyKey)) {
        // conflict with initial propertyKey
        console.warn(`Attempt to rewrite inner attribute ${propertyKey}`);
        return false;
      } else {
        Reflect.defineProperty(target, propertyKey, {
          // use Proxy for recursion
          value: new Proxy({
            _value: typeof descriptor.value == 'function' ?
              null : descriptor.value,
            // cautious: the real _parent should be target itself
            // when we define property, parent object is target
            // attribute is parent[propertyKey]
            _parent: target,
            _name: propertyKey,
            _function: typeof descriptor.value == 'function' ?
              descriptor.value : null,
            _type: typeof descriptor.value == 'function' ?
              'function' : 'value',
            _link: _makeLinkList(null, propertyKey, target),
          }, handler),
          ...defaultObjectConfigs
        });
        return true;
      }
    },
  },
  init() {
    let handler = this.handler;
    // if (arguments.length == 0) return new Proxy(defaultProxyObject, handler);
    if (arguments.length == 0) {
      let temp = new Proxy(defaultProxyObject, handler);
      // let temp = Object.assign(new Proxy(defaultProxyObject, handler));
      return temp;
    }
    else return new Proxy(arguments, handler);
    // else return Object.assign(new Proxy(arguments, handler));
  }
}

function lObject() {

}

// for Node.js
module.exports = linkObject;
// for Browser
// export default linkObject;
