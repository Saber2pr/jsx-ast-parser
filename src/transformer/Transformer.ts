import * as Ast from '../parser/Ast'
import * as Factory from '../parser/Factory'
import * as Jsx from './Jsx'

export const transformIdentityExpr = (identity: Ast.IdentityExpr): string => {
  return identity.name
}

export const transformNumberExpr = (number: Ast.NumberExpr): number => {
  return number.value
}

export const transformStringExpr = (string: Ast.StringExpr): string => {
  return string.value
}

export const transformBooleanExpr = (boolean: Ast.BooleanExpr): boolean => {
  return boolean.value
}

export const transformTextExpr = (text: Ast.TextExpr): Jsx.TextElement => {
  return {
    tagName: 'text',
    nodeValue: text.value,
  }
}

export const transformObjectExpr = (
  object: Ast.ObjectExpr
): { [k: string]: any } => {
  const props = object.props
  return Object.fromEntries(
    Object.entries(props).map(([key, node]) => {
      switch (node.kind) {
        case 'ArrayExpr':
          return [key, transformArrayExpr(node)]
        case 'BooleanExpr':
          return [key, transformBooleanExpr(node)]
        case 'JsxExpr':
          return [key, transformJsx(node)]
        case 'NumberExpr':
          return [key, transformNumberExpr(node)]
        case 'ObjectExpr':
          return [key, transformObjectExpr(node)]
        case 'StringExpr':
          return [key, transformStringExpr(node)]
        default:
          return [key, null]
      }
    }, {})
  )
}

export const transformArrayExpr = (array: Ast.ArrayExpr): any[] => {
  const items = array.items
  return items.map(node => {
    switch (node.kind) {
      case 'ArrayExpr':
        return transformArrayExpr(node)
      case 'BooleanExpr':
        return transformBooleanExpr(node)
      case 'JsxExpr':
        return transformJsx(node)
      case 'NumberExpr':
        return transformNumberExpr(node)
      case 'ObjectExpr':
        return transformObjectExpr(node)
      case 'StringExpr':
        return transformStringExpr(node)
      default:
        return null
    }
  })
}

export const transformPropsExpr = (
  props: Ast.PropExpr[]
): { [k: string]: any } => {
  return Object.fromEntries(
    props.map(prop => {
      const key = prop.key.name
      const node = prop.value
      switch (node.kind) {
        case 'ArrayExpr':
          return [key, transformArrayExpr(node)]
        case 'BooleanExpr':
          return [key, transformBooleanExpr(node)]
        case 'JsxExpr':
          return [key, transformJsx(node)]
        case 'NumberExpr':
          return [key, transformNumberExpr(node)]
        case 'ObjectExpr':
          return [key, transformObjectExpr(node)]
        case 'StringExpr':
          return [key, transformStringExpr(node)]
        default:
          return [key, null]
      }
    })
  )
}

export const transformJsxSelfClosingExpr = (
  jsx: Ast.JsxSelfClosingExpr
): Jsx.JsxElement => {
  const tagName = jsx.tagName.name
  const props = jsx.props
  return {
    tagName,
    props: transformPropsExpr(props),
    children: [],
  }
}

export const transformJsx = (jsx: Ast.Jsx): Jsx.JsxElement => {
  if (Factory.isJsxSelfClosingExpr(jsx)) {
    return transformJsxSelfClosingExpr(jsx)
  }
  const tagName = jsx.openingTag.tagName.name
  const props = jsx.openingTag.props
  const body = jsx.body
  return {
    tagName,
    props: transformPropsExpr(props),
    children: body.map(node => {
      if (Factory.isTextExpr(node)) {
        return transformTextExpr(node)
      } else {
        return transformJsx(node)
      }
    }),
  }
}

export const transform = (program: Ast.Program): any => {
  return program.body.map(jsx => transformJsx(jsx))
}
