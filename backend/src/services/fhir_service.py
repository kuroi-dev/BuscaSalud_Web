# -*- coding: utf-8 -*-
"""
Servicio FHIR para integración superficial con estándares de salud
Simula datos de disponibilidad y recursos médicos
"""

import random
from datetime import datetime, timedelta

class FHIRService:
    """Servicio para simular integración con estándares FHIR/HL7"""
    
    @staticmethod
    def get_hospital_availability(place_id):
        """Simula disponibilidad de hospital usando FHIR"""
        # Datos simulados basados en estándares FHIR
        availability_data = {
            "resourceType": "HealthcareService",
            "id": place_id,
            "active": True,
            "availableTime": [
                {
                    "daysOfWeek": ["mon", "tue", "wed", "thu", "fri"],
                    "availableStartTime": "08:00:00",
                    "availableEndTime": "18:00:00"
                }
            ],
            "notAvailable": [],
            "availabilityExceptions": "Emergencias 24/7"
        }
        
        # Simular tiempo de espera realista
        wait_times = {
            "emergency": random.randint(15, 45),
            "consultation": random.randint(30, 90),
            "specialist": random.randint(60, 180)
        }
        
        return {
            "fhir_data": availability_data,
            "wait_times": wait_times,
            "status": "available" if random.choice([True, True, False]) else "busy",
            "next_appointment": (datetime.now() + timedelta(hours=random.randint(2, 48))).isoformat()
        }
    
    @staticmethod
    def get_pharmacy_stock(place_id):
        """Simula inventario de farmacia usando FHIR Medication"""
        # Medicamentos comunes simulados
        medications = [
            {
                "resourceType": "Medication",
                "id": "med-001",
                "code": {"text": "Paracetamol 500mg"},
                "status": "active",
                "amount": {"value": random.randint(50, 200)}
            },
            {
                "resourceType": "Medication", 
                "id": "med-002",
                "code": {"text": "Ibuprofeno 400mg"},
                "status": "active",
                "amount": {"value": random.randint(30, 150)}
            },
            {
                "resourceType": "Medication",
                "id": "med-003", 
                "code": {"text": "Amoxicilina 500mg"},
                "status": "active" if random.choice([True, False]) else "inactive",
                "amount": {"value": random.randint(0, 100)}
            }
        ]
        
        return {
            "pharmacy_id": place_id,
            "medications": medications,
            "last_updated": datetime.now().isoformat(),
            "fhir_version": "4.0.1"
        }
    
    @staticmethod
    def get_hl7_patient_data():
        """Simula datos de paciente usando estándares HL7"""
        return {
            "resourceType": "Patient",
            "id": "patient-demo",
            "active": True,
            "name": [{"family": "Demo", "given": ["Usuario"]}],
            "gender": "unknown",
            "birthDate": "1990-01-01",
            "address": [{
                "use": "home",
                "city": "Santiago",
                "country": "CL"
            }],
            "telecom": [
                {
                    "system": "phone",
                    "value": "+56912345678",
                    "use": "mobile"
                }
            ]
        }
    
    @staticmethod
    def get_health_services_summary(place_type):
        """Resumen de servicios de salud según tipo de lugar"""
        services_map = {
            "hospital": [
                {"code": "emergency", "name": "Urgencias", "available": True},
                {"code": "surgery", "name": "Cirugía", "available": True},
                {"code": "cardiology", "name": "Cardiología", "available": random.choice([True, False])},
                {"code": "pediatrics", "name": "Pediatría", "available": True}
            ],
            "pharmacy": [
                {"code": "prescription", "name": "Medicamentos con receta", "available": True},
                {"code": "otc", "name": "Venta libre", "available": True},
                {"code": "consultation", "name": "Consulta farmacéutica", "available": True}
            ],
            "dentist": [
                {"code": "cleaning", "name": "Limpieza dental", "available": True},
                {"code": "extraction", "name": "Extracciones", "available": True},
                {"code": "orthodontics", "name": "Ortodoncia", "available": False}
            ]
        }
        
        return services_map.get(place_type, [])