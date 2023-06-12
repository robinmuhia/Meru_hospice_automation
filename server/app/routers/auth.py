from fastapi import APIRouter,Depends,status,HTTPException
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import database, oauth2,schemas,models,utils


router = APIRouter(tags=['Authentication'])

@router.get("/verifylogin/{id}")
def login(id:int,current_user:int = Depends(oauth2.get_current_user)):
    if id == current_user.id:
        return {"message":"authenticated"}
    return {"message":"Unauthenticated"}


@router.post('/login',response_model=schemas.Token)
def login(user_credentials: OAuth2PasswordRequestForm = Depends(),db:Session = Depends(database.get_db)):
    doctor = db.query(models.Doctor).filter(models.Doctor.email == user_credentials.username).first()

    if not doctor:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Invalid credentials")

    if not utils.verify(user_credentials.password,doctor.password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid credentials")
     
    access_token = oauth2.create_access_token(data={"doctor_id":doctor.id})

    return {"access_token":access_token, "token_type":"Bearer","user":doctor}

    
