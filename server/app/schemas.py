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
    owner_id:int

    class Config:
        orm_mode = True
        

class PatientsOut(BaseModel):
    patients: List[PatientOut] | Optional[str] = None

    class Config:
        orm_mode = True
        

class PostBase(BaseModel):
    title:str
    content: str
    published: bool = True


class PostCreate(PostBase):
    pass


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class PostResponse(PostBase):
    id:int
    created_at: datetime
    owner_id: int
    owner: DoctorOut
    
    class Config:
        orm_mode = True


class PostOut(BaseModel):
    Post:PostResponse
    votes: int

class Token(BaseModel):
    access_token:str
    token_type:str


class TokenData(BaseModel):
    id : Optional[str] = None

