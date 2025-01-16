import os
import sys
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Test settings
test_settings = {
    "DATABASE_URL": "sqlite:///:memory:",
    "SECRET_KEY": "test_secret_key",
    "ALGORITHM": "HS256",
    "ACCESS_TOKEN_EXPIRE_MINUTES": "30",
    "REFRESH_TOKEN_EXPIRE_DAYS": "7",
    "SMTP_SERVER": "test_smtp_server",
    "SMTP_PORT": "587",
    "SENDER_EMAIL": "test@example.com",
    "SENDER_PASSWORD": "test_password",
    "TWILIO_ACCOUNT_SID": "test_sid",
    "TWILIO_AUTH_TOKEN": "test_token",
    "TWILIO_PHONE_NUMBER": "+1234567890",
    "FRONTEND_URL": "http://localhost:3000",
    "STRIPE_SECRET_KEY": "test_stripe_key",
    "STRIPE_WEBHOOK_SECRET": "test_webhook_secret"
}

for key, value in test_settings.items():
    os.environ[key] = str(value)

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import Base, get_db
from app.apis import auth

def create_test_app():
    app = FastAPI()
    app.include_router(auth.router)
    return app

engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def test_app():
    app = create_test_app()
    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)

@pytest.fixture
def user_data():
    return {
        "email": "test@example.com",
        "username": "testuser",
        "password": "TestPassword123!",
        "phone_number": "+1234567890",
        "address": "123 Test St, Test City",
        "role": "user"
    }

def test_register_success(test_app, user_data):
    response = test_app.post("/register", json=user_data)
    assert response.status_code == 201
    assert "user_id" in response.json()
    assert response.json()["message"] == "User registered successfully"

def test_register_missing_role(test_app, user_data):
    data = user_data.copy()
    data.pop("role")
    response = test_app.post("/register", json=data)
    assert response.status_code == 400

def test_register_duplicate_email(test_app, user_data):
    # First registration
    test_app.post("/register", json=user_data)
    
    # Second registration with same email
    response = test_app.post("/register", json=user_data)
    assert response.status_code == 400
    assert response.json()["detail"] == "Email is already registered."

def test_register_invalid_email(test_app, user_data):
    invalid_user = user_data.copy()
    invalid_user["email"] = "invalid-email"
    
    response = test_app.post("/register", json=invalid_user)
    assert response.status_code == 422  # FastAPI validation error
    error_detail = response.json()["detail"][0]
    assert "value is not a valid email address" in error_detail["msg"]

def test_register_empty_email(test_app, user_data):
    invalid_user = user_data.copy()
    invalid_user["email"] = ""
    
    response = test_app.post("/register", json=invalid_user)
    assert response.status_code == 422  # FastAPI validation error

def test_login_success(test_app, user_data):
    # Register first
    test_app.post("/register", json=user_data)
    
    # Then login
    login_data = {
        "email": user_data["email"],
        "password": user_data["password"]
    }
    response = test_app.post("/login", json=login_data)
    
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert "refresh_token" in response.json()
    assert "token_type" in response.json()

def test_login_invalid_credentials(test_app, user_data):
    # Register first
    test_app.post("/register", json=user_data)
    
    # Try login with wrong password
    login_data = {
        "email": user_data["email"],
        "password": "WrongPassword123!"
    }
    response = test_app.post("/login", json=login_data)
    
    assert response.status_code == 401 
    assert response.json()["detail"] == "Incorrect email or password."

def test_login_nonexistent_user(test_app):
    login_data = {
        "email": "nonexistent@example.com",
        "password": "SomePassword123!"
    }
    
    response = test_app.post("/login", json=login_data)
    assert response.status_code == 401 
    assert response.json()["detail"] == "Incorrect email or password."

def test_login_missing_fields(test_app):
    incomplete_login = {
        "email": "test@example.com"
    }
    
    response = test_app.post("/login", json=incomplete_login)
    assert response.status_code == 422  # FastAPI validation error