import Vue from 'vue'

// App State shared among components
const appState = Vue.observable({
  // the user profile info
  showTooltips: true,
  content: [],
  months: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
})

// quick access to configuration data
export const generalConfig = {
  ctaDisplayTimeout: 2200
}

export function setAppError (err, message) {
  appState.error = err
  appState.errorMessage = message
}
export default appState
