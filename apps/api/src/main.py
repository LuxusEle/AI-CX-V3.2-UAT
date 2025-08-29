from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from src.routers import auth, clients, projects, boms, vendors, pos, quotes, workflows, agent, admin, health, ui, lead

app = FastAPI(title="Nexus ERP API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(clients.router, prefix="/clients", tags=["clients"])
app.include_router(projects.router, prefix="/projects", tags=["projects"])
app.include_router(boms.router, prefix="/boms", tags=["boms"])
app.include_router(quotes.router, prefix="/quotes", tags=["quotes"])
app.include_router(lead.router, prefix="/leads", tags=["leads"])
app.include_router(vendors.router, prefix="/vendors", tags=["vendors"])
app.include_router(pos.router, prefix="/pos", tags=["purchase_orders"])
app.include_router(workflows.router, prefix="/workflows", tags=["workflows"])
app.include_router(agent.router, tags=["assistant"])
app.include_router(admin.router, tags=["admin"])
app.mount("/static", StaticFiles(directory="apps/api/static"), name="static")
app.include_router(ui.router, tags=["ui"])
