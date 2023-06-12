import models,schemas,oauth2
from fastapi import status,HTTPException,Response,Depends,APIRouter
from sqlalchemy.orm import Session
from database import get_db


router = APIRouter(
    prefix="/patient",
    tags = ['patient']
)


@router.post("/{id}", status_code=status.HTTP_201_CREATED,response_model=schemas.PatientOut)
def create_patient(patient:schemas.PatientCreate,id:int,db:Session = Depends(get_db),doctor:int = Depends(oauth2.get_current_user)):
    patient_exists = db.query(models.Patient).filter(models.Patient.name == patient.name).filter(models.Patient.phone_number == patient.phone_number).first()
    if patient_exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f'{patient.name} with phone number 0{patient.phone_number} is already in use')
    
    if id != doctor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                    detail='Not authorized to perform requested action')        
        
    new_patient = models.Patient(owner_id = doctor.id,**patient.dict())
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient



@router.get('/{id}',status_code=status.HTTP_200_OK,response_model=schemas.PatientOut)
def get_one_patient(id:int,db:Session = Depends(get_db),doctor:int = Depends(oauth2.get_current_user)): 
    patient = db.query(models.Patient).filter(models.Patient.id== id).first()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Patient with id {id} does not exist')
    if patient.owner_id != doctor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='Not authorized to perform requested action')

    return patient


@router.delete("/{id}",status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(id:int,db:Session = Depends(get_db),current_Patient:int = Depends(oauth2.get_current_user)):
    patient_query = db.query(models.Patient).filter(models.Patient.id == id)
    deleted_patient = patient_query.first()
    
    if deleted_patient == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Patient with id: {id} does not exist')

    if deleted_patient.id != current_Patient.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='Not authorized to perform requested action')

    patient_query.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.put("/{id}",status_code=status.HTTP_200_OK,response_model=schemas.PatientOut)
def update_patient(id:int,updated_patient:schemas.PatientCreate,db:Session = Depends(get_db),doctor:int = Depends(oauth2.get_current_user)):
    patient_query = db.query(models.Patient).filter(models.Patient.id == id)
    patient = patient_query.first()
    if patient == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'No patient with id {id} exists')

    
    if patient.owner_id != doctor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='Not authorized to perform requested action')               
    
    patient_query.update(updated_patient.dict(),synchronize_session=False)
    db.commit()
    return patient_query.first()