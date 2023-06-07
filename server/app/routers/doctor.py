import models,schemas,utils
from fastapi import status,HTTPException,Depends,APIRouter
from sqlalchemy.orm import Session
from database import get_db


router = APIRouter(
    prefix="/doctor",
    tags = ['doctor']
)


@router.post("/", status_code=status.HTTP_201_CREATED,response_model=schemas.DoctorOut)
def create_doctor(doctor:schemas.DoctorCreate,db:Session = Depends(get_db)):
    doctor_exists = db.query(models.Doctor).filter(models.Doctor.email == doctor.email).first()
    if doctor_exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f'Email {doctor.email} is already in use')


    hashed_password = utils.hash(doctor.password)
    doctor.password = hashed_password
    new_doctor = models.Doctor(**doctor.dict())
    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)
    return new_doctor

    
