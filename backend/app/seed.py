if __name__ == "__main__":
    from .database import SessionLocal, Base, engine
    Base.metadata.create_all(bind=engine)
    from . import crud, schemas
    db = SessionLocal()
    if not crud.list_cupcakes(db):
        crud.create_cupcake(db, schemas.CupcakeCreate(name="Choco Bliss", description="Chocolate com ganache.", price=8.5, image_url="https://picsum.photos/seed/choco/400/300"))
        crud.create_cupcake(db, schemas.CupcakeCreate(name="Red Velvet", description="Clássico Red Velvet.", price=9.0, image_url="https://picsum.photos/seed/velvet/400/300"))
        crud.create_cupcake(db, schemas.CupcakeCreate(name="Limão Siciliano", description="Fresco e cítrico.", price=8.0, image_url="https://picsum.photos/seed/limao/400/300"))
        print("Seed OK")
    else:
        print("Já possui cupcakes")
