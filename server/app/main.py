import uvicorn
from fastapi import FastAPI
import models
from database import engine
from routers import doctor, note_image, auth,patient,dashboard
from fastapi.middleware.cors import CORSMiddleware


models.Base.metadata.create_all(bind=engine)

app = FastAPI()    

origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins = [],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(note_image.router)
app.include_router(doctor.router)
app.include_router(auth.router)
app.include_router(patient.router)
app.include_router(dashboard.router)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
    



