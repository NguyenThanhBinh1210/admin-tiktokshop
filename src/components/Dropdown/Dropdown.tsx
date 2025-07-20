import React, { useState, useEffect, useRef } from 'react'

interface Option {
  _id: any
  ratio: string
  level: string
  name: string
}

interface DropdownProps {
  options: Option[]
  onSelect: (option: Option) => void
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSelectOption = (option: Option) => {
    setSelectedOption(option)
    setIsOpen(false)
    onSelect(option)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div ref={dropdownRef} className='relative inline-block text-left'>
      <div>
        <span className='rounded-md shadow-sm'>
          <button
            type='button'
            className='inline-flex justify-center w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150'
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup='true'
            aria-expanded={isOpen ? 'true' : 'false'}
          >
            {selectedOption ? selectedOption.name : 'Select'}
            <svg className='-mr-1 ml-2 h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M7.293 8.293a1 1 0 011.414 0L10 9.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </span>
      </div>
      {isOpen && (
        <div className='origin-top-right absolute right-0 mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'>
          <div className='py-1' role='menu' aria-orientation='vertical' aria-labelledby='options-menu'>
            {options.map((option) => (
              <button
                key={option._id}
                onClick={() => handleSelectOption(option)}
                className='block w-full px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
                role='menuitem'
              >
                <p className='text-slate-950'>{option.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown
