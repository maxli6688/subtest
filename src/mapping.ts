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
import { ipfs, json, JSONValueKind } from '@graphprotocol/graph-ts'

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
  const path = space.metadataUrl.replace('ipfs://', '')
  const data = ipfs.cat(path)
  // space.name = event.params.imageUrl
  if (data) {
    const res = json.fromBytes(data)
    if (res.kind === JSONValueKind.OBJECT) {
      const obj = res.toObject()
      if (obj.get('name')) {
        space.name = obj.get('name')!.toString()
      }
      if (obj.get('description')) {
        space.description = obj.get('description')!.toString()
      }
    }
  }
  space.save()
}
