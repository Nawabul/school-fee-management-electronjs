import { Dropdown, DropdownItem } from 'flowbite-react'
import { JSX } from 'react'

export default function EditButton(): JSX.Element {
  return (
    <Dropdown
      label={<span className="font-bold text-primary-500">Edit</span>}
      inline
      arrowIcon={false}
    >
      <DropdownItem>Pay Fees</DropdownItem>
      <DropdownItem>Pay Mis. Fees</DropdownItem>
      <DropdownItem>Edit</DropdownItem>
      <DropdownItem>Delete</DropdownItem>
    </Dropdown>
  )
}
