from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import crud, schemas

router = APIRouter(prefix="/transactions", tags=["Transactions"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def create(data: schemas.TransactionCreate, db: Session = Depends(get_db)):
    return crud.create_transaction(db, data)


@router.get("/")
def get_all(type: str = None, category: str = None, db: Session = Depends(get_db)):
    return crud.get_transactions(db, type, category)


@router.put("/{id}")
def update(id: int, data: schemas.TransactionCreate, db: Session = Depends(get_db)):
    txn = crud.update_transaction(db, id, data)
    if not txn:
        raise HTTPException(status_code=404, detail="Not found")
    return txn


@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    txn = crud.delete_transaction(db, id)
    if not txn:
        raise HTTPException(status_code=404, detail="Not found")
    return {"msg": "Deleted"}