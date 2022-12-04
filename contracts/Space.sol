// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Space {
  event NewGravatar(uint256 id, address owner, string displayName, string imageUrl);
  event UpdatedGravatar(uint256 id, address owner, string displayName, string imageUrl);

  struct Gravatar {
    address owner;
    string displayName;
    string imageUrl;
    // string details;
  }

  Gravatar[] public gravatars;

  mapping(uint256 => address) public gravatarToOwner; // id : address
  mapping(address => uint256[]) public ownerToGravatars; // 1 v 1

  function createGravatar(string memory _displayName, string memory _imageUrl) public {
    // require(ownerToGravatar[msg.sender] == 0);
    // Gravatar memory grav = Gravatar(msg.sender, _displayName, _imageUrl);
    gravatars.push(Gravatar(msg.sender, _displayName, _imageUrl));
    uint256 id = gravatars.length;

    gravatarToOwner[id] = msg.sender;
    ownerToGravatars[msg.sender].push(id);

    emit NewGravatar(id, msg.sender, _displayName, _imageUrl);
  }

  function getGravatarById(uint256 id) public view returns (string memory, string memory) {
    // uint256 id = ownerToGravatar[owner];
    return (gravatars[id].displayName, gravatars[id].imageUrl);
  }

  function getGravatas() public view returns (uint256[] memory) {
    // uint256 id = ownerToGravatar[owner];
    return ownerToGravatars[msg.sender];
  }

  function updateGravatarName(uint256 id, string memory _displayName) public {
    require(msg.sender == gravatars[id].owner, "owner addrss error");
    gravatars[id].displayName = _displayName;
    emit UpdatedGravatar(id, msg.sender, _displayName, gravatars[id].imageUrl);
  }

  function updateGravatarImage(uint256 id, string memory _imageUrl) public {
    // require(ownerToGravatar[msg.sender] != 0);
    require(msg.sender == gravatars[id].owner, "owner addrss error");

    // uint256 id = ownerToGravatar[msg.sender];

    gravatars[id].imageUrl = _imageUrl;
    emit UpdatedGravatar(id, msg.sender, gravatars[id].displayName, _imageUrl);
  }

  // function getGravatar(address owner) public view returns (string memory, string memory) {
  //   uint256 id = ownerToGravatar[owner];
  //   return (gravatars[id].displayName, gravatars[id].imageUrl);
  // }

  // function updateGravatarName(string memory _displayName) public {
  //   require(ownerToGravatar[msg.sender] != 0);
  //   require(msg.sender == gravatars[ownerToGravatar[msg.sender]].owner);

  //   uint256 id = ownerToGravatar[msg.sender];

  //   gravatars[id].displayName = _displayName;
  //   emit UpdatedGravatar(id, msg.sender, _displayName, gravatars[id].imageUrl);
  // }

  // function updateGravatarImage(string memory _imageUrl) public {
  //   require(ownerToGravatar[msg.sender] != 0);
  //   require(msg.sender == gravatars[ownerToGravatar[msg.sender]].owner);

  //   uint256 id = ownerToGravatar[msg.sender];

  //   gravatars[id].imageUrl = _imageUrl;
  //   emit UpdatedGravatar(id, msg.sender, gravatars[id].displayName, _imageUrl);
  // }

  // the gravatar at position 0 of gravatars[]
  // is fake
  // it's a mythical gravatar
  // that doesn't really exist
  // dani will invoke this function once when this contract is deployed
  // but then no more
  function setMythicalGravatar() public {
    require(msg.sender == 0x8d3e809Fbd258083a5Ba004a527159Da535c8abA);
    gravatars.push(Gravatar(address(0), " ", " "));
  }
}
