from jose import JWTError,jwt
from datetime import datetime,timedelta
import schemas,database,models
from sqlalchemy.orm import Session
from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')

SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_DAYS = settings.access_token_expire_days


def create_access_token(data:dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp":expire})

    jwt_token = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
    return jwt_token


def verify_token(token:str, credentials_exception):
    try:
        paylod = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        id:str = paylod.get('doctor_id')

        if id is None:
            raise credentials_exception

        token_data = schemas.TokenData(id=id)
    except JWTError:
        raise credentials_exception
    
    return token_data



def get_current_user(token:str = Depends(oauth2_scheme),db:Session = Depends(database.get_db)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail='Could not validate credentials',headers={"WWW-Authenticate":"Bearer"})
    token = verify_token(token,credentials_exception)
    user = db.query(models.Doctor).filter(models.Doctor.id == token.id).first()
    return user