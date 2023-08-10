import { ethers } from "ethers";
import assert from "assert";

export function isValidString(s) {
  if (s != null && typeof s === "string" && s !== "") {
    return true;
  }
  return false;
}
export function shortenAddress(address) {
  if (!isValidString(address)) {
    return "";
  }
  return `${address.substr(0, 4)}...${address.substr(-4)}`;
}

export function shortenAddressLong(address) {
  if (!isValidString(address)) {
    return "";
  }
  return `${address.substr(0, 10)}...${address.substr(-10)}`;
}

// this actually will round up in some cases
export const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 4,
}).format;

export function formatUnits(
  wei,
  decimals
){
  return numberFormatter(Number(ethers.utils.formatUnits(wei, decimals)));
}

export function formatEther(wei) {
  return formatUnits(wei, 18);
}

export function formatEtherRaw(wei) {
  return ethers.utils.formatUnits(wei, 18);
}

export function parseUnits(value, decimals) {
  return ethers.utils.parseUnits(value, decimals);
}

export function parseEther(value) {
  return parseUnits(value, 18);
}

export function stringToHex(value) {
  return ethers.utils.hexlify(ethers.utils.toUtf8Bytes(value));
}

// appends hex tag to data
export function tagHex(dataHex, tagHex) {
  assert(ethers.utils.isHexString(dataHex), "Data must be valid hex string");
  return ethers.utils.hexConcat([dataHex, tagHex]);
}

// converts a string tag to hex and appends, currently not in use
export function tagString(dataHex, tagString) {
  return tagHex(dataHex, stringToHex(tagString));
}

// tags only an address
export function tagAddress(dataHex, address) {
  assert(ethers.utils.isAddress(address), "Data must be a valid address");
  return tagHex(dataHex, address);
}
