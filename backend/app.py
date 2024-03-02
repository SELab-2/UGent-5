from typing import Optional

from cas import CASClient
from fastapi import FastAPI
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.requests import Request

from src import config

app = FastAPI()
origins = ["https://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cas_client = CASClient(
    version=2,
    service_url=f"{config.CONFIG.api_url}/login?next=%2Fprofile",
    server_url=f"{config.CONFIG.cas_server_url}",
)
app.add_middleware(SessionMiddleware, secret_key="!secret")


@app.get("/api")
async def root():
    return {"message": "Hello World"}


@app.get("/profile")
async def profile(request: Request):
    print(request.session.get("user"))
    user = request.session.get("user")
    if user:
        return {"user": user}
        return HTMLResponse(
            'Logged in as %s. <a href="/logout">Logout</a>' % user["user"]
        )
    return HTMLResponse('Login required. <a href="/login">Login</a>', status_code=403)


@app.get("/login")
def login(request: Request, next: Optional[str] = None, ticket: Optional[str] = None):
    if request.session.get("user", None):
        # Already logged in
        # TODO: dit is hardcoded, moet nog op een of andere manier aangepast worden
        return RedirectResponse("https://localhost:5173/home")

    if not ticket:
        # No ticket, the request come from end user, send to CAS login
        cas_login_url = cas_client.get_login_url()
        print("CAS login URL: %s", cas_login_url)
        return RedirectResponse(cas_login_url)

    # There is a ticket, the request come from CAS as callback.
    # need call `verify_ticket()` to validate ticket and get user profile.
    print(f"ticket: {ticket}")
    print(f"next: {next}")

    user, attributes, pgtiou = cas_client.verify_ticket(ticket)

    print(
        "CAS verify ticket response: user: %s, attributes: %s, pgtiou: %s",
        user,
        attributes,
        pgtiou,
    )

    if not user:
        return HTMLResponse('Failed to verify ticket. <a href="/login">Login</a>')
    else:  # Login successfully, redirect according `next` query parameter.
        if not next:
            return
        # response = RedirectResponse(next)
        # TODO: dit is hardcoded, moet nog op een of andere manier aangepast worden
        response = RedirectResponse("https://localhost:5173/home")
        request.session["user"] = dict(user=user)
        return response


@app.get("/logout")
def logout(request: Request):
    redirect_url = request.url_for("logout_callback")
    cas_logout_url = cas_client.get_logout_url(redirect_url)
    print("CAS logout URL: %s", cas_logout_url)
    return RedirectResponse(cas_logout_url)


@app.get("/logout_callback")
def logout_callback(request: Request):
    # redirect from CAS logout request after CAS logout successfully
    request.session.pop("user", None)
    return HTMLResponse('Logged out from CAS. <a href="/login">Login</a>')
