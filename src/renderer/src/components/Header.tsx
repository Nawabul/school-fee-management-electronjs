import { Button } from 'flowbite-react'
import { JSX } from 'react'
import { Link } from 'react-router-dom'

interface HeaderProps {
  title: string
  subtitle: string
  buttonText?: string
  buttonLink?: string
  icon?: JSX.Element
}

const Header = ({ title, subtitle, buttonText, buttonLink, icon }: HeaderProps): JSX.Element => {
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex gap-4 justify-center items-center">
        {icon}
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>
      {buttonLink && (
        <Link to={buttonLink}>
          <Button color="alternative">{buttonText}</Button>
        </Link>
      )}
    </header>
  )
}

export default Header
