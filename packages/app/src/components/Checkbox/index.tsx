import QuestionHelper from '../QuestionHelper'
import React from 'react'
import Settings from '../Settings'

export type Color = 'pink' | 'blue' | 'indigo'

const COLOR = {
  pink: 'checked:bg-pink checked:border-transparent focus:ring-pink',
  blue: 'checked:bg-blue checked:border-transparent focus:ring-blue',
  indigo: 'checked:bg-indigo checked:border-transparent focus:ring-indigo',
}

export interface CheckboxProps {
  color: Color
  set: (value: boolean) => void
}

function Checkbox({
  color,
  set,
  className = '',
  ...rest
}: CheckboxProps & React.InputHTMLAttributes<HTMLInputElement>): JSX.Element {
  return (
    <input
      type="checkbox"
      onChange={(event) => set(event.target.checked)}
      className={`h-5 w-5 rounded-sm bg-dark-700 border-transparent disabled:bg-dark-1000 disabled:border-dark-800 cursor-pointer ${COLOR[color]} ${className}`}
      {...rest}
    />
  )
}

export default Checkbox
