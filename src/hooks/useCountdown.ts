'use client'
// forked from https://usehooks-ts.com/react-hook/use-countdown
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type { Dispatch, SetStateAction } from 'react'

/** The countdown's options. */
interface CountdownOptions {
  /** The countdown's starting number, initial value of the returned number. */
  countStart: number

  /**
   * The countdown's interval, in milliseconds.
   * @default 1000
   */
  intervalMs?: number
  /**
   * True if the countdown is increment.
   * @default false
   */
  isIncrement?: boolean

  /**
   * The countdown's stopping number. Pass `-Infinity` to decrease forever.
   * @default 0
   */
  countStop?: number
}

/** The countdown's controllers. */
interface CountdownControllers {
  /** Start the countdown. */
  startCountdown: () => void
  /** Stop the countdown. */
  stopCountdown: () => void
  /** Reset the countdown. */
  resetCountdown: () => void
}

/**
 * Custom hook that manages countdown.
 * @param {CountdownOptions} countdownOptions - The countdown's options.
 * @returns {[number, CountdownControllers]} An array containing the countdown's count and its controllers.
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-countdown)
 * @example
 * ```tsx
 * const [counter, { start, stop, reset }] = useCountdown({
 *   countStart: 10,
 *   intervalMs: 1000,
 *   isIncrement: false,
 * });
 * ```
 */
export default function useCountdown({
  countStart,
  countStop = 0,
  intervalMs = 1000,
  isIncrement = false,
}: CountdownOptions): [number, CountdownControllers] {
  const {
    count,
    increment,
    decrement,
    reset: resetCounter,
  } = useCounter(countStart)

  /*
   * Note: used to control the useInterval
   * running: If true, the interval is running
   * start: Should set running true to trigger interval
   * stop: Should set running false to remove interval.
   */
  const {
    value: isCountdownRunning,
    setTrue: startCountdown,
    setFalse: stopCountdown,
  } = useBoolean(false)

  // Will set running false and reset the seconds to initial value.
  const resetCountdown = useCallback(() => {
    stopCountdown()
    resetCounter()
  }, [stopCountdown, resetCounter])

  const countdownCallback = useCallback(() => {
    if (count === countStop) {
      stopCountdown()
      return
    }

    if (isIncrement) {
      increment()
    } else {
      decrement()
    }
  }, [count, countStop, decrement, increment, isIncrement, stopCountdown])

  useInterval(countdownCallback, isCountdownRunning ? intervalMs : null)

  return [count, { startCountdown, stopCountdown, resetCountdown }]
}

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  // Remember the latest callback if it changes.
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (delay === null) {
      return
    }

    const id = setInterval(() => {
      savedCallback.current()
    }, delay)

    return () => {
      clearInterval(id)
    }
  }, [delay])
}

/** The hook return type. */
interface UseCounterReturn {
  /** The current count value. */
  count: number
  /** Function to increment the counter by 1. */
  increment: () => void
  /** Function to decrement the counter by 1. */
  decrement: () => void
  /** Function to reset the counter to its initial value. */
  reset: () => void
  /** Function to set a specific value to the counter. */
  setCount: Dispatch<SetStateAction<number>>
}

function useCounter(initialValue?: number): UseCounterReturn {
  const [count, setCount] = useState(initialValue ?? 0)

  const increment = useCallback(() => {
    setCount((x) => x + 1)
  }, [])

  const decrement = useCallback(() => {
    setCount((x) => x - 1)
  }, [])

  const reset = useCallback(() => {
    setCount(initialValue ?? 0)
  }, [initialValue])

  return {
    count,
    increment,
    decrement,
    reset,
    setCount,
  }
}

/** The useBoolean return type. */
interface UseBooleanReturn {
  /** The current boolean state value. */
  value: boolean
  /** Function to set the boolean state directly. */
  setValue: Dispatch<SetStateAction<boolean>>
  /** Function to set the boolean state to `true`. */
  setTrue: () => void
  /** Function to set the boolean state to `false`. */
  setFalse: () => void
  /** Function to toggle the boolean state. */
  toggle: () => void
}

function useBoolean(defaultValue?: boolean): UseBooleanReturn {
  const [value, setValue] = useState(!!defaultValue)

  const setTrue = useCallback(() => {
    setValue(true)
  }, [])

  const setFalse = useCallback(() => {
    setValue(false)
  }, [])

  const toggle = useCallback(() => {
    setValue((x) => !x)
  }, [])

  return { value, setValue, setTrue, setFalse, toggle }
}
