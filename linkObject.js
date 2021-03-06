/*
 * Editor: Eric Leung
 * Created: 2020/12/25
 * License: Apache License 2.0
 */

// constant definitions
const defaultObjectConfigs = { writable: true, enumerable: true, configurable: true }
const nonEnumerable = { writable: true, enumerable: false, configurable: true }

// A function to build linkObject object instead of IIFE
const defaultProxyObject = () => {
  let $i = Object.create({});
  Object.defineProperties($i, {
    '_value': { value: null, ...nonEnumerable },
    '_parent': { value: null, ...nonEnumerable },
    '_name': { value: 'root', ...nonEnumerable },
    '_function': { value: null, ...nonEnumerable },
    '_type': { value: null, ...nonEnumerable },
    '_link': { value: ['root'], ...nonEnumerable }
  });
  return $i;
}
const attributeList = ['_value', '_parent', '_name', '_function', '_type', '_link'];

// inner functions
/**
 * Format an object with linkObject(by using recursion)
 * @param { any } source source object to be copied
 * @param { string } name new attribute name
 * @param { any } parent parent of new attribute
 * @returns { any } return an object copied from source
 */
const _copyLinkObject = (source, name, parent) => {
  // let tempProxyObject = Object.assign({}, defaultProxyObject);
  let tempProxyObject = defaultProxyObject();
  tempProxyObject._parent = parent;
  tempProxyObject._name = name;
  tempProxyObject._link = _makeLinkList(tempProxyObject);
  // function
  if (typeof source == 'function') {
    tempProxyObject._type = 'function';
    tempProxyObject._function = source;
    return tempProxyObject;
  }
  // Array or Object
  else if (source instanceof Array || typeof source == 'object') {
    let nameSet = Object.keys(source);
    // for (const i in source) {
    for (const singleName of nameSet) {
      Object.defineProperty(tempProxyObject, singleName, {
        value: _copyLinkObject(source[singleName], singleName, tempProxyObject),
        ...defaultObjectConfigs
      });
    }
    return tempProxyObject;
  }
  // value
  else {
    tempProxyObject._type = 'value';
    tempProxyObject._value = source;
    return tempProxyObject;
  }
}

/**
 * inner function for getter  
 * it needs to initialize with name  
 * or will make error for mistaking caller
 * @param { Array<any> } _link link to be called
 * @returns { any } target Object
 */
const callLink = (link) => {
  let targetObject = link[0];
  let attributeLink = link.slice(1, link.length);
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

const _makeLinkList = (currentNode) => {
  let linkList = [];
  let tempNode = currentNode;
  while (tempNode._name) {
    linkList.push(tempNode._name);
    if (tempNode._parent) tempNode = tempNode._parent;
    else {
      linkList.reverse();
      // linkList.push(propertyKey);
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
    /*
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
    */

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
          value: new Proxy((() => {
            let $i = defaultProxyObject();
            $i._value = typeof descriptor.value == 'function' ?
              null : descriptor.value;
            // cautious: the real _parent should be target itself
            // when we define property, parent object is target
            // attribute is parent[propertyKey]
            $i._parent = target;
            $i._name = propertyKey;
            $i._function = typeof descriptor.value == 'function' ?
              descriptor.value : null;
            $i._type = typeof descriptor.value == 'function' ?
              'function' : 'value';
            /**
             * _makeLinkList owns parameter: currentNode
             * which means the real target node currently is $i
             */
            $i._link = _makeLinkList($i);
            return $i;
          })(),
            handler
          ),
          ...defaultObjectConfigs
        });
        return true;
      }
    },
  },

  // will abandon in future
  /*
  init() {
    let handler = this.handler;
    if (arguments.length == 0) {
      // need to copy to reconstruct a new object
      // return new Proxy(Object.assign({}, defaultProxyObject), handler);
      // return new Proxy(_copyObjectDeep(defaultProxyObject), handler);
      return ;
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
  */

  /**
   * initialize an Object with name
   * @param { String } name target Object 
   * @param  { ...any } source (Optional) Object to be add with _link
   */
  initWithName(name, ...source) {
    let handler = this.handler;
    if (typeof name != 'string') {
      throw Error("Wrong variable name format detected");
    } else {
      if (source.length == 0) {
        // let templateProxyObject = Object.assign({}, defaultProxyObject);
        let templateProxyObject = defaultProxyObject();
        console.log(templateProxyObject);
        templateProxyObject._name = name;
        templateProxyObject._link = [name];
        return new Proxy(templateProxyObject, handler);
      }
      else {
        source = source.length == 1 ? source[0] : source;
        return new Proxy(_copyLinkObject(source, name, null), handler);
      }
    }
  },

  /**
   * convert linked object into general object (Using recursion)  
   * However, general object doesn't contain the attribute of self value  
   * The value itself will be stored with name called "_self"  
   * @param { linkObject } source source linkObject
   * @returns { any } the source Object
   */
  returnToGeneral(source) {
    let target = {};
    // target._self = source._type == 'function' ? source._function : source._value;
    Reflect.defineProperty(target, '_self', {
      value: source._type == 'function' ? source._function : source._value,
      ...nonEnumerable
    });
    if (Object.keys(source).length == 0) {
      // approaches to leaf node
      return source._type == 'function' ? source._function : source._value;
    } else {
      for (let i of Object.keys(source)) {
        // target[`${i}`] = this.returnToGeneral(source[i]);
        Reflect.defineProperty(target, `${i}`, {
          value: this.returnToGeneral(source[i]),
          ...defaultObjectConfigs
        });
      }
    }
    return target;
  }
}

// for Node.js
module.exports = linkObject;
// for Browser
// export default linkObject;