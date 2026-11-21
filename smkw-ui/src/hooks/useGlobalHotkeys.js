import { useEffect } from 'react'
import { exitMatch } from '../game/session'
import { SCREENS } from '../navigation/screens'
import { selectCurrentScreen, useNavigationStore } from '../stores/navigationStore'

const TEXT_INPUT_TYPES = new Set(['text', 'search', 'email', 'password', 'number', 'url', 'tel'])

function isTextField(target) {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable || target.tagName === 'TEXTAREA') return true
  return target.tagName === 'INPUT' && TEXT_INPUT_TYPES.has(target.type)
}

function isInteractive(target) {
  return target instanceof HTMLElement && target.closest('button, a, input, select, textarea') !== null
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen?.().catch(() => {})
  } else {
    document.documentElement.requestFullscreen?.().catch(() => {})
  }
}

// Raccourcis globaux (un seul listener, état lu à la volée) :
// F = plein écran ; Entrée = jouer depuis le menu principal ;
// Échap = fermer les réglages, sinon écran précédent, ou quitter la partie en jeu.
export function useGlobalHotkeys() {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return

      if (isTextField(event.target)) {
        // Dans un champ texte, Échap rend seulement la main (pas de retour arrière involontaire).
        if (event.key === 'Escape') event.target.blur()
        return
      }

      const navigation = useNavigationStore.getState()
      const screen = selectCurrentScreen(navigation)

      switch (event.key) {
        case 'f':
        case 'F':
          toggleFullscreen()
          break
        case 'Escape':
          if (navigation.settingsOpen) navigation.closeSettings()
          else if (screen === SCREENS.GAME) exitMatch()
          else navigation.back()
          break
        case 'Enter':
          // Sur un bouton focalisé, le clic natif s'en charge déjà.
          if (screen === SCREENS.MAIN_MENU && !navigation.settingsOpen && !isInteractive(event.target)) {
            navigation.navigate(SCREENS.MODE_SELECT)
          }
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
