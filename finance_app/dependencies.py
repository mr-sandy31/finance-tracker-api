def check_admin(user_role: str):
    if user_role != "admin":
        raise Exception("Only admin allowed")