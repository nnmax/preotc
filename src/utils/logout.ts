'use client'
import { MessageLocalStorageKey, SignatureLocalStorageKey } from '@/constant'

export default function logout() {
  window.localStorage.removeItem(MessageLocalStorageKey)
  window.localStorage.removeItem(SignatureLocalStorageKey)
}
