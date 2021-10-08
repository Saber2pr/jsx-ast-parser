/*
 * @Author: saber2pr
 * @Date: 2021-09-12 12:05:43
 * @Last Modified by: saber2pr
 * @Last Modified time: 2021-10-08 19:44:02
 */
import * as Jsx from '../transformer/Jsx'
import * as Factory from '../transformer/Factory'

// basic
export function compileString(element: string) {
  return `"${element}"`
}

export function compileNumber(element: number) {
  return `${+element}`
}

export function compileBoolean(element: boolean) {
  return `${element ? 'true' : 'false'}`
}

export function compileArray(element: Jsx.Type[]) {
  return `[${element.map(value => compile(value)).join(',')}]`
}

export function compileIdentity(element: Jsx.Identity) {
  const name = element.name
  return name
}

export function compileJsxObject(element: Jsx.JsxObject | null) {
  if (element === null) return 'null'
  const entries = Factory.getElementEntries(element)
  return `{${entries
    .map(([key, value]) => `${key}:${compile(value)}`)
    .join(',')}}`
}

// jsx
export function compileTextElement(element: Jsx.TextElement) {
  return `${element.nodeValue}`
}

export function compileJsxAttributes(element: Jsx.JsxAttributes): string {
  const entries = Factory.getElementEntries(element)
  if (entries.length === 0) return ''
  return ` ${entries
    .map(([key, value]) => {
      // basic
      if (typeof value === 'string') {
        return `${key}="${value}"`
      }
      if (typeof value === 'number') {
        return `${key}={${value}}`
      }
      if (typeof value === 'boolean') {
        if (value) {
          return `${key}`
        } else {
          return `${key}={false}`
        }
      }
      // jsx
      if (Factory.isTextElement(value)) {
        return `${key}="${value.nodeValue}"`
      }
      // statement
      return `${key}={${compile(value)}}`
    })
    .join(' ')}`
}

export function compileJsxElement(element: Jsx.JsxElement) {
  const tagName = element.tagName
  const props = element.props
  const elements = element.children

  // compile jsx element
  const attributes = compileJsxAttributes(props)
  if (Array.isArray(elements) && elements.length > 0) {
    const children = Array.isArray(elements)
      ? elements.map(element => compile(element)).join('')
      : `{${compile(elements)}}`
    return `<${tagName}${attributes}>${children}</${tagName}>`
  }

  // self closing
  return `<${tagName}${attributes}/>`
}

// expression
export function compileBlock(element: Jsx.Block) {
  const body = element.statements ?? []
  return `{${body.map(statement => compile(statement)).join(';')}}`
}

export function compileParameter(args: Jsx.Parameter = []): string {
  return args.map(arg => compile(arg)).join(',')
}

export function compileArrowFunction(element: Jsx.ArrowFunction) {
  const args = element.args ?? []
  const body = element.body ?? []
  return `${
    Factory.isIdentity(args)
      ? compileIdentity(args)
      : `(${compileParameter(args)})`
  }=>${compile(body)}`
}

export function compileFunction(element: Jsx.Function) {
  const name = element.name ?? ''
  const args = element.args ?? []
  const body = element.body ?? []
  return `function ${name}(${compileParameter(args)})${compileBlock(body)}`
}

export function compileCallChain(element: Jsx.CallChain): string {
  const caller = element.caller
  const chain = element.chain ?? []
  const args = element.args ?? []
  return `${caller}.${chain.join('.')}(${compileParameter(args)})`
}

export function compileVariableAssign(assign: Jsx.VariableAssign): string {
  const { name, value } = assign
  return `${name}${value ? ` = ${compile(value)}` : ''}`
}

// statement

export function compileDefineVariable(def: Jsx.DefineVariable): string {
  const { type, assign } = def
  return `${type ? `${type} ` : ''}${
    Factory.isIdentity(assign)
      ? compileIdentity(assign)
      : compileVariableAssign(assign)
  }`
}

export function compileIf(ifElse: Jsx.If): string {
  const { args, body, els } = ifElse
  return `if(${compileParameter(args)})${compile(body)}${
    els ? `else ${compile(els)}` : ''
  }`
}

export function compileReturn(ret: Jsx.Return): string {
  const { value } = ret
  return `return ${compile(value)}`
}

export function compileProgram(program: Jsx.Program): string {
  const { body = [] } = program
  return body.map(statement => compile(statement)).join(';')
}

// compile code
export function compile(element: Jsx.Type): string {
  // program
  if (Factory.isProgram(element)) {
    return compileProgram(element)
  }
  // text element
  if (Factory.isTextElement(element)) {
    return compileTextElement(element)
  }
  // jsx element
  if (Factory.isJsxElement(element)) {
    return compileJsxElement(element)
  }
  if (Array.isArray(element)) {
    return compileArray(element)
  }
  if (element === null || Factory.isJsxObject(element)) {
    return compileJsxObject(element)
  }
  // expression
  if (Factory.isArrowFunction(element)) {
    return compileArrowFunction(element)
  }
  if (Factory.isFunction(element)) {
    return compileFunction(element)
  }
  if (Factory.isCallChain(element)) {
    return compileCallChain(element)
  }
  if (Factory.isVariableAssign(element)) {
    return compileVariableAssign(element)
  }
  // statement
  if (Factory.isDefineVariable(element)) {
    return compileDefineVariable(element)
  }
  if (Factory.isIf(element)) {
    return compileIf(element)
  }
  if (Factory.isReturn(element)) {
    return compileReturn(element)
  }
  if (Factory.isBlock(element)) {
    return compileBlock(element)
  }
  if (Factory.isIdentity(element)) {
    return compileIdentity(element)
  }
  // basic
  if (typeof element === 'string') {
    return compileString(element)
  }
  if (typeof element === 'number') {
    return compileNumber(element)
  }
  if (typeof element === 'boolean') {
    return compileBoolean(element)
  }
  return ''
}
