"""
Modelo para lugares de salud
"""
from dataclasses import dataclass
from typing import List, Dict, Optional

@dataclass
class HealthPlace:
    """Modelo para un lugar de salud"""
    place_id: str
    name: str
    address: str
    lat: float
    lng: float
    rating: float = 0.0
    user_ratings_total: int = 0
    price_level: int = 0
    types: List[str] = None
    open_now: Optional[bool] = None
    photo_reference: str = ""
    
    def __post_init__(self):
        if self.types is None:
            self.types = []

@dataclass
class DetailedHealthPlace(HealthPlace):
    """Modelo detallado para un lugar de salud"""
    phone: str = ""
    website: str = ""
    opening_hours: Dict = None
    reviews: List[Dict] = None
    photos: List[str] = None
    
    def __post_init__(self):
        super().__post_init__()
        if self.opening_hours is None:
            self.opening_hours = {}
        if self.reviews is None:
            self.reviews = []
        if self.photos is None:
            self.photos = []

@dataclass
class SearchLocation:
    """Modelo para ubicación de búsqueda"""
    address: str
    lat: float
    lng: float