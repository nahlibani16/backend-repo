from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas, database

app = FastAPI(title="Article Microservice API")

# Izinkan akses CORS dari frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/article/", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_article(article: schemas.ArticleCreate, db: Session = Depends(database.get_db)):
    crud.create_article(db=db, article=article)
    return {}

@app.get("/article/{limit}/{offset}", response_model=List[schemas.ArticleResponse])
def read_articles(limit: int, offset: int, db: Session = Depends(database.get_db)):
    return crud.get_articles(db, limit=limit, offset=offset)

@app.get("/article/{article_id}", response_model=schemas.ArticleResponse)
def read_article(article_id: int, db: Session = Depends(database.get_db)):
    db_article = crud.get_article_by_id(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return db_article

@app.post("/article/{article_id}", response_model=dict)
@app.put("/article/{article_id}", response_model=dict)
@app.patch("/article/{article_id}", response_model=dict)
def update_article(article_id: int, article: schemas.ArticleUpdate, db: Session = Depends(database.get_db)):
    updated = crud.update_article(db=db, article_id=article_id, article_data=article)
    if updated is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return {}

@app.delete("/article/{article_id}", response_model=dict)
@app.post("/article/delete/{article_id}", response_model=dict)
def delete_article(article_id: int, db: Session = Depends(database.get_db)):
    deleted = crud.delete_article(db=db, article_id=article_id)
    if deleted is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return {}