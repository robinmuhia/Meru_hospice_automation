from database import Base
from sqlalchemy import Column,Integer,String,ForeignKey
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text
from sqlalchemy.orm import relationship
    

class Doctor(Base):
    __tablename__ = 'doctors'
    
    email = Column(String,nullable=False,unique=True)
    password = Column(String,nullable=False)
    id = Column(Integer,primary_key = True, nullable = False)
    created_at = Column(TIMESTAMP(timezone=True),nullable=False,server_default = text('now()'))
    
    
class Patient(Base):
    __tablename__ = 'patients'
    
    id = Column(Integer,primary_key = True, nullable = False)
    name = Column(String,nullable=False)
    age = Column(Integer,nullable=False)
    phone_number = Column(Integer, nullable = False)
    created_at = Column(TIMESTAMP(timezone=True),nullable=False,server_default = text('now()'))
    num_images = Column(Integer,nullable=True)
    owner_id = Column(Integer,ForeignKey("doctors.id",ondelete="CASCADE"),nullable = False)
        
    owner = relationship("Doctor")


class Note(Base):
    __tablename__ = 'notes'

    id = Column(Integer,primary_key = True, nullable = False)
    disease_symptoms = Column(String,nullable = False)
    content = Column(String,nullable = False)
    prescription = Column(String,nullable = False)
    owner_id = Column(Integer,ForeignKey("patients.id",ondelete="CASCADE"),nullable = False)
    created_at = Column(TIMESTAMP(timezone=True),nullable=False,server_default = text('now()'))

    owner = relationship("Patient")



