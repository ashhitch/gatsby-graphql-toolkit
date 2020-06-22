import { NodeInput } from "gatsby"
import { inspect } from "util"
import { ISourcingContext, IRemoteNode } from "../../../types"
import { processRemoteNode } from "./process-remote-node"
import { getGatsbyNodeDefinition } from "../utils/node-definition-helpers"

export async function createNodes(
  context: ISourcingContext,
  remoteTypeName: string,
  remoteNodes: AsyncIterable<IRemoteNode>
) {
  const typeNameField = context.gatsbyFieldAliases["__typename"]
  for await (const remoteNode of remoteNodes) {
    if (!remoteNode || remoteNode[typeNameField] !== remoteTypeName) {
      // Possible when fetching complex interface or union type fields
      // or when some node is `null`
      continue
    }
    await createNode(context, remoteNode)
  }
}

export async function createNode(
  context: ISourcingContext,
  remoteNode: IRemoteNode
) {
  const { gatsbyApi, gatsbyFieldAliases } = context
  const { actions, createContentDigest } = gatsbyApi

  const typeNameField = gatsbyFieldAliases["__typename"]
  const remoteTypeName = remoteNode[typeNameField]

  if (!remoteTypeName || typeof remoteTypeName !== `string`) {
    throw new Error(
      `Remote node doesn't have expected field ${typeNameField}:\n` +
        inspect(remoteNode)
    )
  }

  const def = getGatsbyNodeDefinition(context, remoteTypeName)

  // TODO: assert that all expected fields exist, i.e. remoteTypeName, remoteNodeId
  //   also assert that Gatsby internal field names are not used
  //   i.e. "internal", "id", "parent", "children", "__typename", etc
  //   (Technically this should be caught in fragments validation before running a query
  //   but we should probably double-check for safety)

  const nodeData = await processRemoteNode(context, def, remoteNode)

  const node: NodeInput = {
    ...nodeData,
    id: context.idTransform.remoteNodeToGatsbyId(remoteNode, def),
    parent: undefined,
    internal: {
      contentDigest: createContentDigest(remoteNode),
      type: context.typeNameTransform.toGatsbyTypeName(def.remoteTypeName),
    },
  }

  await actions.createNode(node)
}
