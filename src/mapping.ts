// import { NewGravatar, UpdatedGravatar } from '../generated/Gravity/Gravity'
// import { Gravatar } from '../generated/schema'
// export function handleNewGravatar(event: NewGravatar): void {
//   let gravatar = new Gravatar(event.params.id.toHex())
//   gravatar.owner = event.params.owner
//   gravatar.displayName = event.params.displayName
//   gravatar.imageUrl = event.params.imageUrl
//   gravatar.save()
// }

// export function handleUpdatedGravatar(event: UpdatedGravatar): void {
//   let id = event.params.id.toHex()
//   let gravatar = Gravatar.load(id)
//   if (gravatar == null) {
//     gravatar = new Gravatar(id)
//   }
//   gravatar.owner = event.params.owner
//   gravatar.displayName = event.params.displayName
//   gravatar.imageUrl = event.params.imageUrl
//   gravatar.save()
// }
import { Bytes, ipfs, json, JSONValueKind } from '@graphprotocol/graph-ts'

import { NewGravatar, UpdatedGravatar } from '../generated/Space/Space'
import { NewSpaceRegistered } from '../generated/SpaceManager/SpaceManager'
import { Space, SpaceManager } from '../generated/schema'

export function handleNewGravatar(event: NewGravatar): void {
  let gravatar = new Space(event.params.id.toHex())
  gravatar.owner = event.params.owner
  gravatar.displayName = event.params.displayName
  gravatar.imageUrl = event.params.imageUrl
  gravatar.save()
}

export function handleUpdatedGravatar(event: UpdatedGravatar): void {
  let id = event.params.id.toHex()
  let gravatar = Space.load(id)
  if (gravatar == null) {
    gravatar = new Space(id)
  }
  gravatar.owner = event.params.owner
  gravatar.displayName = event.params.displayName
  gravatar.imageUrl = event.params.imageUrl
  gravatar.save()
}

export function handleNewSpaceRegistered(event: NewSpaceRegistered): void {
  let id = event.params.newSpaceId.toHex()
  let space = SpaceManager.load(id)
  if (space == null) {
    space = new SpaceManager(id)
  }
  space.owner = event.params.registerAddress
  space.metadataUrl = event.params.detail
  space.name = ''
  space.description = ''
  space.image = ''
  const path = space.metadataUrl.replace('ipfs://', '')
  const ipfsData = ipfs.cat(path)
  // if (ipfsData != null) {
  if (ipfsData) {
    // const res = json.fromBytes(ipfsData)
    // if (res.kind === JSONValueKind.OBJECT) {
    // const data = res.toObject()
    const data = json.fromBytes(ipfsData as Bytes).toObject()
    if (data.get('name')) {
      space.name = data.get('name')!.toString()
    }
    if (data.get('description')) {
      space.description = data.get('description')!.toString()
    }
    if (data.get('image')) {
      // space.image = data.get('image')?.isNull ? "" : data.get('image')!.toString()
      space.image = data.get('image')!.toString()
    }
  }
  // let hexHash = addQm(event.params.details) as Bytes
  // let base58Hash = hexHash.toBase58()
  // space.ipfsHash = base58Hash
  space.save()
}
