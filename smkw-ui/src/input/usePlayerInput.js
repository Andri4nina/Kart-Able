import { useEffect, useRef } from 'react'
import { useLocalPlayersStore } from '../stores/localPlayersStore'
import { useNavigationStore } from '../stores/navigationStore'
import { subscribeToInput } from './inputManager'
import { toPlayerInput } from './playerInput'

// Abonne un écran aux entrées des joueurs tant qu'il est affiché.
// `handler(playerInput)` renvoie true s'il a utilisé l'entrée. Ignoré pendant les paramètres.
export function usePlayerInput(handler) {
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  })

  useEffect(
    () =>
      subscribeToInput((deviceInput) => {
        if (useNavigationStore.getState().settingsOpen) return false
        return handlerRef.current(toPlayerInput(deviceInput, useLocalPlayersStore.getState().slots))
      }),
    [],
  )
}
