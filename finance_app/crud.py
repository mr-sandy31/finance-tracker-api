from sqlalchemy.orm import Session
from models import Transaction

def create_transaction(db: Session, data):
    txn = Transaction(**data.dict())
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return txn


def get_transactions(db: Session, type=None, category=None):
    query = db.query(Transaction)

    if type:
        query = query.filter(Transaction.type == type)
    if category:
        query = query.filter(Transaction.category == category)

    return query.all()


def update_transaction(db: Session, id: int, data):
    txn = db.query(Transaction).filter(Transaction.id == id).first()
    if not txn:
        return None

    for key, value in data.dict().items():
        setattr(txn, key, value)

    db.commit()
    db.refresh(txn)
    return txn


def delete_transaction(db: Session, id: int):
    txn = db.query(Transaction).filter(Transaction.id == id).first()
    if not txn:
        return None

    db.delete(txn)
    db.commit()
    return txn