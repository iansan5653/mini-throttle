export interface ThrottleOptions {
  /**
   * Fire at the start of a sequence of calls.
   */
  start?: boolean
  /**
   * Fire in the middle of a sequence of calls when `wait` has passed.
   */
  middle?: boolean
  /**
   * Fire at the end of a sequence of calls.
   */
  end?: boolean
  /**
   * Cancel after the first successful call. Will never call again.
   */
  once?: boolean
}

interface Throttler<T extends unknown[]> {
  (...args: T): void
  /** Cancel any pending calls and never call the function again. */
  cancel(): void
}

export function throttle<T extends unknown[]>(
  callback: (...args: T) => unknown,
  wait = 0,
  {start = true, middle = true, once = false, end = true}: ThrottleOptions = {}
): Throttler<T> {
  /** Time of last made call in this sequence, or time of start of sequence if a call hasn't been made yet. */
  let lastCall = 0
  let lastAttempt = 0
  let endTimer: ReturnType<typeof setTimeout>
  let cancelled = false

  function fn(this: Throttler<T>, ...args: T) {
    if (cancelled) return

    const makeCall = () => {
      clearTimeout(endTimer)
      lastCall = Date.now()
      callback.apply(this, args)
      if (once) fn.cancel()
    }

    const isStartOfSequence = Date.now() - lastAttempt >= wait
    lastAttempt = Date.now()

    if (isStartOfSequence) lastCall = Date.now()

    // start: If it has been a sufficient time since the last attempt, start a new sequence
    if (start && isStartOfSequence) {
      makeCall()
      return
    }

    // middle: If it has been sufficient time since the last successful call, make another call
    if (middle && Date.now() - lastCall >= wait) {
      makeCall()
      return
    }

    // end: Schedule a call for after the sequence ends, if it hasn't already been handled
    if (end) {
      clearTimeout(endTimer)
      endTimer = setTimeout(() => makeCall(), wait)
    }
  }

  fn.cancel = () => {
    clearTimeout(endTimer)
    cancelled = true
  }

  return fn
}

// debounce is just throttle but with only an ending call
export function debounce<T extends unknown[]>(
  callback: (...args: T) => unknown,
  wait = 0,
  {start = false, middle = false, once = false, end = true}: ThrottleOptions = {}
): Throttler<T> {
  return throttle(callback, wait, {start, middle, once, end})
}
