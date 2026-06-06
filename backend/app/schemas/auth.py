from pydantic import BaseModel,EmailStr

class RegisterUser(BaseModel):
    first_name:str
    last_name:str
    email:EmailStr
    password:str
    role_id:int

class LoginUser(BaseModel):
    email:EmailStr
    password:str