from django.urls import path
from . import views

urlpatterns = [
    path('doctors/', views.doctors, name='doctors'),
    path('register', views.register, name='register'),
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
    path('me', views.me, name='me'),
    path('fetch_external', views.fetch_external, name='fetch_external'),
]
