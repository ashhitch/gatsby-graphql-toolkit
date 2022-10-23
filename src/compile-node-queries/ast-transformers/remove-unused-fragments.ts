import {
  DocumentNode,
  FragmentDefinitionNode,
  OperationDefinitionNode,
} from "graphql"
import { ASTReducer } from "graphql/language/visitor"
import * as GraphQLAST from "../../utils/ast-nodes"
import { isFragment, isOperation } from "../../utils/ast-predicates"

type FragmentName = string

export function removeUnusedFragments(): ASTReducer<DocumentNode | void> {
  let currentSpreads: Array<FragmentName> = []
  const definitionSpreads: Map<string, Array<FragmentName>> = new Map()

  return {
    FragmentSpread: {
      enter: node => currentSpreads.push(node.name.value),
      leave: () => {},
    },
    // enter: {
    //   FragmentSpread: node => {
    //     currentSpreads.push(node.name.value)
    //   },
    // },
    OperationDefinition: {
      leave: node => {
        const name = (node as unknown as OperationDefinitionNode).name?.value
        if (!name) {
          throw new Error("Every query must have a name")
        }
        definitionSpreads.set(name, currentSpreads)
        currentSpreads = []
      },
    },
    FragmentDefinition: {
      leave: node => {
        const name = (node as unknown as FragmentDefinitionNode).name?.value
        definitionSpreads.set(name, currentSpreads)
        currentSpreads = []
      },
    },
    Document: {
      leave: xnode => {
        const node = xnode as unknown as DocumentNode
        const operations = node.definitions.filter(isOperation)
        const operationNames = operations.map(op => op.name?.value)

        const usedSpreads = new Set(
          operationNames.reduce(collectSpreadsRecursively, [])
        )
        const usedFragments = node.definitions.filter(
          node => isFragment(node) && usedSpreads.has(node.name.value)
        )
        return GraphQLAST.document([...operations, ...usedFragments])
      },
    },
  }
  function collectSpreadsRecursively(
    acc: Array<FragmentName>,
    definitionName: string | void
  ) {
    if (!definitionName) {
      return acc
    }
    const spreads = definitionSpreads.get(definitionName) ?? []
    return spreads.length === 0
      ? acc
      : spreads.reduce(collectSpreadsRecursively, acc.concat(spreads))
  }
}
