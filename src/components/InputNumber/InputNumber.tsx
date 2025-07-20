import { forwardRef, InputHTMLAttributes, useState } from 'react'
export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  placeholder?: string
  required?: boolean
}
const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  { onChange, classNameInput, placeholder, value, required, ...rest },
  ref
) {
  const [localValue, setLocalValue] = useState<string>(value as string)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (/^\d+$/.test(value) || value === '') {
      onChange && onChange(event)
      setLocalValue(value)
    }
  }
  return (
    <div>
      <input
        className={`${classNameInput ? classNameInput : ''} `}
        type='text'
        placeholder={placeholder}
        value={value === undefined ? localValue : value}
        onChange={handleChange}
        required={required}
        {...rest}
        ref={ref}
      />
    </div>
  )
})

export default InputNumber
