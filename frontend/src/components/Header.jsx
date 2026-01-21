import { HeartIcon } from '@heroicons/react/24/outline'

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-brand">
            <HeartIcon className="header-icon" />
            <div>
              <h1 className="header-title">BuscaSalud</h1>
              <p className="header-subtitle">Encuentra lugares de salud cerca de ti</p>
            </div>
          </div>
          
          <nav className="header-nav">
            <a href="#">
              Inicio
            </a>
            <a href="#">
              Acerca de
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header