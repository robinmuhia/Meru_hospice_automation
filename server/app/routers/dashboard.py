import models,schemas,oauth2
from fastapi import status,HTTPException,Depends,APIRouter
from sqlalchemy.orm import Session
from database import get_db
from typing import Optional
from sqlalchemy import desc


router = APIRouter(
    prefix="/dashboard",
    tags = ['dashboard']
)


@router.get('/{id}',status_code=status.HTTP_200_OK,response_model=schemas.PatientsOut)
def get_all_patients(id:int,doctor:int = Depends(oauth2.get_current_user),db:Session = Depends(get_db),pageSize:Optional[int] = 20,page:Optional[int] = 1,search:Optional[str] = ''):
    
    if type(pageSize) != int or type(page) != int or type(search) != str or page < 0 or pageSize < 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f'Unproccessible parameters')
        
    search = ''.join(search.lower().split())
    if id != doctor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='Not authorized to perform requested action')
        
    patients = db.query(models.Patient).filter(models.Patient.owner_id == id).filter(models.Patient.lower_name.contains(search)).order_by(desc("created_at")).limit(pageSize).offset(page*pageSize).all()
    return {"patients":patients}

