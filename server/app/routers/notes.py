import models,schemas,oauth2
from fastapi import Response,status,HTTPException,Depends,APIRouter
from sqlalchemy.orm import Session
from database import get_db
from sqlalchemy import desc


router = APIRouter(
    prefix="/notes",
    tags = ['notes']
)


@router.post("/{id}", status_code=status.HTTP_201_CREATED,response_model=schemas.NoteOut)
def create_note(id:int,note:schemas.NoteCreate,db:Session = Depends(get_db),doctor:int = Depends(oauth2.get_current_user)):
    patient = db.query(models.Patient).filter(models.Patient.id == id).first()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Patient with id {id} does not exist')
    if patient.owner_id != doctor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                    detail='Not authorized to perform requested action') 
    
    new_result = models.Note(owner_id = id,**note.dict())
    db.add(new_result)
    db.commit()
    db.refresh(new_result)
    return new_result


@router.get('/{id}',status_code=status.HTTP_200_OK,response_model=schemas.NotesOut)
def get_notes(id:int,db:Session = Depends(get_db),doctor:int = Depends(oauth2.get_current_user)):
    patient = db.query(models.Patient).filter(models.Patient.id == id).first()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Patient with id {id} does not exist')
    if patient.owner_id != doctor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                    detail='Not authorized to perform requested action')
        
    notes = db.query(models.Note).filter(patient.id == models.Note.owner_id).order_by(desc("created_at")).all()

    return {"notes":notes,"owner":patient}


@router.get('/specific/{id}',status_code=status.HTTP_200_OK,response_model=schemas.NoteOut)
def get_note(id:int,db:Session = Depends(get_db),doctor:int = Depends(oauth2.get_current_user)):
    note = db.query(models.Note).filter(models.Note.id == id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Note with id {id} does not exist')
        
    patient = db.query(models.Patient).filter(models.Patient.id == note.owner_id).first()
    if patient.owner_id != doctor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                    detail='Not authorized to perform requested action')
        
    return note


@router.delete("/{id}",status_code=status.HTTP_204_NO_CONTENT)
def delete_note(id:int,db:Session = Depends(get_db),doctor:int = Depends(oauth2.get_current_user)):
    note_query = db.query(models.Note).filter(models.Note.id == id)
    deleted_note = note_query.first()
    if deleted_note == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Note with id: {id} does not exist')
        
    patient = db.query(models.Patient).filter(models.Patient.id == deleted_note.owner_id).first()
    if patient.owner_id != doctor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='Not authorized to perform requested action')

    note_query.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.put("/{id}",status_code=status.HTTP_200_OK,response_model=schemas.NoteOut)
def update_note(id:int,updated_note:schemas.NoteCreate,db:Session = Depends(get_db),doctor:int = Depends(oauth2.get_current_user)):
    note_query = db.query(models.Note).filter(models.Note.id == id)
    note = note_query.first()
    if note == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'No Note with id {id} exists')

    patient = db.query(models.Patient).filter(models.Patient.id == note.owner_id).first()
    if patient.owner_id != doctor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail='Not authorized to perform requested action')              
    
    note_query.update(updated_note.dict(),synchronize_session=False)
    db.commit()
    return note_query.first()
