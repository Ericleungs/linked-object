/*
 * Editor: Eric Leung
 * Created: 2020/12/25
 * License: Apache License 2.0
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
 * inner function for getter  
 * it needs to initialize with name  
 * or will make error for mistaking caller
 * @param { Array<any> } _link link to be called
 * @returns { any } target Object
 */
let callLink = (_link) => {
  let targetObject = _link[0];
  let attributeLink = _link.slice(1, _link.length);
  let attributeLinkStr = '';
  for (const i of attributeLink) {
    attributeLinkStr = attributeLinkStr.concat(`['${i}']`);
  }
  return eval(`${targetObject}${attributeLinkStr}`);
}

/**
 * copy an array deeply by using recursion
 * @param { any } source Source array need to be copied
 * @return { any } a new target array
 */
const _copyArray = (source) => {
  let temp = [];
  for (const i of source) {
    if (i instanceof Array) temp.push(_copyArray(i));
    else temp.push(i);
  }
  return temp;
}

/**
 * copy an Object deeply with recursion
 * @param { { any } } source the source Object to be copied
 * @returns { any } a new Object copies the source object
 */
const _copyObjectDeep = (source) => {
  if (typeof source == 'object') {
    let tempObj = Object.create({});
    Object.assign(tempObj, source);
    for (const i of Object.keys(source)) _copyObjectDeep(i);
    return tempObj;
  }
  else return source;
}

const _makeLinkList = (_target, propertyKey, receiver) => {
  // _target seems redundant
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
     * getter will not be familiar to used in Node.js REPL
     */
    get(target, propertyKey) {
      // in fact, target is node itself instead of the whole tree
      let excluded = ['_parent', '_name', '_value', '_function', '_type'];
      let callExcluded = true;
      // Exclude the inner property key
      for (const i of excluded) {
        if (propertyKey == i) {
          callExcluded = false;
          break;
        }
      }
      if (callExcluded) return Reflect.get(target, propertyKey);
      else {
        if (target._type == 'function') return Reflect.get(target, '_function');
        else return Reflect.get(target[propertyKey], '_value');
      }
    },

    /**
     * rewrite Object.defineProperty method  
     * CAUTIONS:  
     * it will trap all setters in this Object
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
            // 'null' is just a placeholder
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
    if (arguments.length == 0) {
      // need to copy to reconstruct a new object
      // return new Proxy(Object.assign({}, defaultProxyObject), handler);
      return new Proxy(_copyObjectDeep(defaultProxyObject), handler);
    }
    else if (arguments.length == 1) {
      return new Proxy(_copyObjectDeep(arguments[0]), handler);
    }
    // else return new Proxy(Object.assign({}, arguments), handler);
    // else return new Proxy(_copyObjectDeep(arguments), handler);
    else {
      let temp = [];
      arguments.forEach(e => { temp.push(_copyObjectDeep(e)) });
      return new Proxy(temp, handler);
    }
  },
  /**
   * initialize an Object with name
   * @param { String } name target Object 
   * @param  {...any} source (Optional) Object to be add with _link
   */
  initWithName(name, ...source) {
    let handler = this.handler;
    if (typeof name != 'string') {
      throw Error("Wrong variable name format detected");
    } else {
      let templateProxyObject = Object.assign({}, defaultProxyObject);
      templateProxyObject._name = name;
      templateProxyObject._link = [name];
      if (source.length == 0) {
        return new Proxy(Object.assign({}, templateProxyObject), handler);
      }
      else {
        let px = null;
        if (source.length == 1) {
          px = new Proxy(_copyObjectDeep(source[0]), handler);
        } else {
          let temp = [];
          source.forEach(e => { temp.push(_copyObjectDeep(e)) });
          px = new Proxy(temp, handler);
        }
        return px;
      }
    }
  }
}

// for Node.js
module.exports = linkObject;
// for Browser
// export default linkObject;
