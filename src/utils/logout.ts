'use client'
import { disconnect } from 'wagmi/actions'
import { config } from '@/components/providers'
import {
  LoggedInLocalStorageKey,
  MessageLocalStorageKey,
  SignatureLocalStorageKey,
} from '@/constant'

export default function logout() {
  disconnect(config)
  fetch('/pre-otc/disconnect-wallet', {
    method: 'POST',
  })
  window.localStorage.removeItem(MessageLocalStorageKey)
  window.localStorage.removeItem(SignatureLocalStorageKey)
  window.localStorage.removeItem(LoggedInLocalStorageKey)
}
