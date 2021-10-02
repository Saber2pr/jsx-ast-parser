/*
 * @Author: saber2pr
 * @Date: 2021-10-02 15:31:32
 * @Last Modified by:   saber2pr
 * @Last Modified time: 2021-10-02 15:31:32
 */
import * as Jsx from '../transformer/Jsx'
import * as Factory from '../transformer/Factory'

export function traverse(
  node: Jsx.JsxNode,
  callback: (node: Jsx.JsxNode) => Jsx.JsxNode | void
) {
  if (Factory.isTextElement(node)) {
    return callback(node)
  }

  // map children
  const children = node.children
  const newChildren = children.map(node => {
    const newNode = traverse(node, callback)
    if (newNode) {
      return newNode
    }
    return node
  })

  // link new children
  const newNode = callback(node)
  if (newNode) {
    newNode.children = newChildren
    return newNode
  }
  node.children = newChildren
  return node
}

export function findNode(
  root: Jsx.JsxNode,
  filter: (node: Jsx.JsxNode) => boolean
) {
  const result: Jsx.JsxNode[] = []
  traverse(root, node => {
    if (filter(node)) {
      result.push(node)
    }
  })
  return result
}
