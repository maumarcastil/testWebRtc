import { Buffer } from "buffer";

export function parseJwt (token) {
  if (!token) return ""
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  // var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
  //     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  // }).join(''));
  const jsonPayload = Buffer.from(base64, 'base64').toString('ascii')
  console.log({jsonPayload})
  return JSON.parse(jsonPayload)
}