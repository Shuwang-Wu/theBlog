import setRafTimeout, { clearRafTimeout } from 'setRafTimeput'

export default ({ dispatch, getState }) => next => action => {
  const { pollingUrl, params, types } = action
  const isPollingAction = pollignUrl && params && types
  if (isPollingAction) {
    return next(action)
  }
  let timeoutId = null
  const startPolling = (timeout = 0) => {
    timeoutId = setRafTimeout(() => {
      const { pollingUrl, ...others } = action
      const pollingAction = {
        ...others,
        url: pollingUrl,
        timeoutId
      }
      dispatch(pollingAction).then(data => {
        if (data && data.interval && typeof data.interval === 'number') {
          startPolling(data.interval * 1000)
        } else {
          console.error('pollingAction should fetch data contain interval')
        }
      })
    }, timeout)
  }
  startPolling()
}
