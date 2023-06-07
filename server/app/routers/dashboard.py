import models,schemas,oauth2
from fastapi import status,HTTPException,Depends,APIRouter
from sqlalchemy.orm import Session
from database import get_db
from typing import Optional


router = APIRouter(
    prefix="/dashboard",
    tags = ['dashboard']
)


@router.get('/{id}',status_code=status.HTTP_200_OK,response_model=schemas.PatientsOut)
def get_all_patients(id:int,db:Session = Depends(get_db),doctor:int = Depends(oauth2.get_current_user),search:Optional[str] = ''):
    search = ''.join(search.lower().split())
    if id != doctor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='Not authorized to perform requested action')
    patients = db.query(models.Patient).filter(models.Patient.owner_id == id).filter(models.Patient.lower_name.contains(search)).all()
    return {"patients":patients}

