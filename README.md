# Cupcake Delivery — Full Stack

## Como rodar
### Backend
```bash
cd backend
python -m venv .venv
# Windows
./.venv/Scripts/activate && pip install -r requirements.txt
# macOS/Linux
source .venv/bin/activate && pip install -r requirements.txt

cp .env.example .env
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Acesse:
- API: http://localhost:8000/docs
- Web: http://localhost:5173

### Seed
```bash
cd backend && source .venv/bin/activate
python -m app.seed
```
