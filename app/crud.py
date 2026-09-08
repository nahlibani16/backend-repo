from sqlalchemy.orm import Session
from app import models, schemas

def create_article(db: Session, article: schemas.ArticleCreate):
    db_article = models.Post(**article.model_dump())
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

def get_articles(db: Session, limit: int = 10, offset: int = 0):
    return db.query(models.Post).offset(offset).limit(limit).all()

def get_article_by_id(db: Session, article_id: int):
    return db.query(models.Post).filter(models.Post.id == article_id).first()

def update_article(db: Session, article_id: int, article_data: schemas.ArticleUpdate):
    db_article = get_article_by_id(db, article_id)
    if not db_article:
        return None
    for key, value in article_data.model_dump().items():
        setattr(db_article, key, value)
    db.commit()
    db.refresh(db_article)
    return db_article

def delete_article(db: Session, article_id: int):
    db_article = get_article_by_id(db, article_id)
    if not db_article:
        return None
    db.delete(db_article)
    db.commit()
    return db_article