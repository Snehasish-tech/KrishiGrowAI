from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages


# Home Page
def home_page(request):
    return render(request, "accounts/index.html")


# Sign In Page
def signin_page(request):
    if request.method == "POST":
        # Demo mode - database not available on Vercel
        messages.info(request, "Demo mode: Authentication requires database setup")
        return redirect('home')
    return render(request, "accounts/signin.html")  # Sign In template


# Sign Up Page
def signup_page(request):
    if request.method == "POST":
        # Demo mode - database not available on Vercel
        messages.info(request, "Demo mode: Registration requires database setup")
        return redirect('signin')
    return render(request, "accounts/signin.html")  # Reuse the same template with toggle


# Logout
def logout_user(request):
    logout(request)
    return redirect('signin')


# Password Reset Page
def password_reset_page(request):
    if request.method == "POST":
        email = request.POST.get("email")
        # You can integrate Django's password reset logic here
        messages.success(request, f"Password reset link sent to {email} (simulation).")
        return redirect('signin')
    return render(request, "accounts/password_reset.html")  # Create this template
