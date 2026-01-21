const LoadingSpinner = () => {
  return (
    <div className="card loading-container">
      <div className="loading-spinner">
        <div className="spinner">
          <div className="spinner-circle"></div>
          <div className="spinner-pulse"></div>
        </div>
        
        <div>
          <h3 className="card-header">Buscando lugares de salud</h3>
          <p className="empty-description">
            Estamos encontrando los mejores lugares cerca de ti...
          </p>
        </div>

        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner