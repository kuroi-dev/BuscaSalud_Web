import { HeartIcon } from '@heroicons/react/24/outline'

const Header = () => {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <HeartIcon className="h-8 w-8 text-red-300" />
            <div>
              <h1 className="text-2xl font-bold">BuscaSalud</h1>
              <p className="text-blue-200 text-sm">Encuentra lugares de salud cerca de ti</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-blue-200 transition-colors">
              Inicio
            </a>
            <a href="#" className="hover:text-blue-200 transition-colors">
              Acerca de
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header