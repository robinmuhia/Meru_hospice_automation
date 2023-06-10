from pydantic import BaseModel,EmailStr
from datetime import datetime
from typing import Optional,List



class DoctorCreate(BaseModel):
    email:EmailStr
    password:str


class DoctorOut(BaseModel):
    id:int
    email:EmailStr
    created_at:datetime

    class Config:
        orm_mode = True
        

class PatientCreate(BaseModel):
    name:str
    lower_name:str
    age: int
    phone_number:int
    num_images:int


class PatientOut(BaseModel):
    name:str
    age: int
    phone_number:int
    num_images:int
    id:int
    created_at:datetime

    class Config:
        orm_mode = True
        

class PatientsOut(BaseModel):
    patients: List[PatientOut] | Optional[str] = None

    class Config:
        orm_mode = True
        

class NoteCreate(BaseModel):
    disease_symptoms: str
    prescription:str
    content:str


class NoteOut(BaseModel):
    id:int
    disease_symptoms: str
    prescription:str
    content:str
    created_at: datetime
    owner_id: int
    owner: PatientOut
    
    class Config:
        orm_mode = True
        

class NotesOut(BaseModel):
    notes: List[NoteOut] | Optional[str] = None
    
    class Config:
        orm_mode = True

class UserToken(BaseModel):
    id:int
    
    class Config:
        orm_mode = True
        
        
class Token(BaseModel):
    access_token:str
    token_type:str
    user: UserToken

class TokenData(BaseModel):
    id : Optional[str] = None

