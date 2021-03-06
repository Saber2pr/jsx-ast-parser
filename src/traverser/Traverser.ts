/*
 * @Author: saber2pr
 * @Date: 2021-10-02 15:31:32
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-08 19:36:48
 */
import * as Jsx from '../transformer/Jsx'
import * as Factory from '../transformer/Factory'

// Jsx
export function traverseJsxNode(
  node: Jsx.JsxNode,
  callback: (node: Jsx.Type) => Jsx.Type | void
): Jsx.Type {
  if (Factory.isTextElement(node)) {
    return callback(node) ?? node
  }

  // map props
  const newProps = traverseJsxAttributes(node.props, callback)
  // link new props
  node.props = newProps

  // map children
  const children = node.children
  const newChildren = Array.isArray(children)
    ? children.map(node => {
        let newNode: Jsx.Type | void
        if (Factory.isJsxElement(node)) {
          newNode = traverseJsxNode(node, callback)
        }
        if (newNode) {
          return newNode
        }
        return callback(node) ?? node
      })
    : children

  // link new children
  const newNode = callback(node)
  if (newNode) {
    if (Factory.isJsxElement(newNode)) {
      newNode.children = newChildren
    }
    return newNode
  }
  node.children = newChildren
  return node
}

// statement

export function traverseArrowFunction(
  node: Jsx.ArrowFunction,
  callback: (node: Jsx.Type) => Jsx.Type | void
): Jsx.Type {
  // TODO arrow function traverse
  return callback(node) ?? node
}

export function traverseFunction(
  node: Jsx.Function,
  callback: (node: Jsx.Type) => Jsx.Type | void
): Jsx.Type {
  // TODO function traverse
  return callback(node) ?? node
}

export function traverseCallChain(
  call: Jsx.CallChain,
  callback: (node: Jsx.Type) => Jsx.Type | void
): Jsx.Type {
  // TODO call chain traverse
  return callback(call) ?? call
}

export function traverseJsxObject(
  obj: Jsx.JsxObject,
  callback: (node: Jsx.Type) => Jsx.Type | void
): Jsx.JsxObject {
  return Factory.createJsxObject(
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        return [key, traverse(value, callback)]
      })
    )
  )
}

export function traverseJsxAttributes(
  obj: Jsx.JsxAttributes,
  callback: (node: Jsx.Type) => Jsx.Type | void
): Jsx.JsxAttributes {
  return Factory.createJsxAttributes(
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        return [key, traverse(value, callback)]
      })
    )
  )
}

export function traverseProgram(
  program: Jsx.Program,
  callback: (node: Jsx.Type) => Jsx.Type | void
): Jsx.Program {
  const { body = [] } = program
  const newBody = body.map(node => traverse(node, callback))
  const newProgram: Jsx.Program = {
    ...program,
    body: newBody,
  }
  return newProgram
}

export function traverse(
  node: Jsx.Type,
  callback: (node: Jsx.Type) => Jsx.Type | void
): Jsx.Type {
  if (Factory.isProgram(node)) {
    return traverseProgram(node, callback)
  }
  // return leaf node
  if (
    node === null ||
    typeof node === 'string' ||
    typeof node === 'number' ||
    typeof node === 'boolean' ||
    Factory.isTextElement(node)
  ) {
    return callback(node) ?? node
  }
  // jsx
  if (Factory.isJsxElement(node)) {
    return traverseJsxNode(node, callback)
  }
  // array
  if (Array.isArray(node)) {
    return node.map(item => traverse(item, callback))
  }
  // func
  if (Factory.isArrowFunction(node)) {
    return traverseArrowFunction(node, callback)
  }
  // call
  if (Factory.isCallChain(node)) {
    return traverseCallChain(node, callback)
  }
  // obj
  if (Factory.isJsxObject(node)) {
    return traverseJsxObject(node, callback)
  }
  if (Factory.isJsxAttributes(node)) {
    return traverseJsxAttributes(node, callback)
  }
  return callback(node) ?? node
}

export function findNode(root: Jsx.Type, filter: (node: Jsx.Type) => boolean) {
  const result: Jsx.Type[] = []
  traverse(root, node => {
    if (filter(node)) {
      result.push(node)
    }
  })
  return result
}
