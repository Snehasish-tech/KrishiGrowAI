from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_page, name='home'),
    path('signin/', views.signin_page, name='signin'),
    path('signup/', views.signup_page, name='signup'),
    path('password-reset/', views.password_reset_page, name='password_reset'),
    path('api/chatbot/', views.chatbot_api, name='chatbot_api'),
]


