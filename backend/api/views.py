import requests
from django.views.decorators.http import require_GET
from bs4 import BeautifulSoup

# Fetch and return main content from a remote URL (for doctor detail info)
@require_GET
def fetch_external(request):
    url = request.GET.get('url')
    if not url or not (url.startswith('http://') or url.startswith('https://')):
        return JsonResponse({'error': 'Invalid or missing url'}, status=400)
    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'html.parser')
        # Try to extract main content heuristically
        main = soup.find('main') or soup.find('article') or soup.body
        if main:
            # Remove scripts/styles
            for tag in main(['script', 'style']):
                tag.decompose()
            content = main.prettify()
        else:
            content = soup.prettify()
        return JsonResponse({'html': content})
    except Exception as e:
        return JsonResponse({'error': f'Failed to fetch: {str(e)}'}, status=500)
from django.shortcuts import render
from django.http import JsonResponse
import json
import os
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
import uuid


USERS_FILE = os.path.join(os.path.dirname(__file__), '../data/users.json')


def _load_users():
    try:
        with open(USERS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except Exception:
        return []


def _save_users(users):
    os.makedirs(os.path.dirname(USERS_FILE), exist_ok=True)
    with open(USERS_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f, ensure_ascii=False, indent=2)


def doctors(request):
    file_path = os.path.join(os.path.dirname(__file__), '../data/doctors.json')
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Add full image URL for each doctor
    for doctor in data:
        image_rel_path = doctor["Image_File"].replace("\\", "/")
        doctor["Image_URL"] = request.build_absolute_uri(f"/media/{image_rel_path}")

    return JsonResponse(data, safe=False)



@csrf_exempt
def register(request):
    """Register a new user and save to backend/data/users.json.

    Expects JSON body with fields: name, email, password, role, age, gender, insurance, specialty, clinic
    Returns { user, token }
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8') or '{}')
    except Exception:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    role = data.get('role', 'patient')
    age = data.get('age')
    gender = data.get('gender')
    insurance = data.get('insurance')
    specialty = data.get('specialty')
    clinic = data.get('clinic')

    if not email or not password:
        return JsonResponse({'error': 'email and password required'}, status=400)

    users = _load_users()
    if any(u.get('email') == email for u in users):
        return JsonResponse({'error': 'User already exists'}, status=400)

    user_id = str(uuid.uuid4())
    hashed = make_password(password)
    user = {
        'id': user_id,
        'name': name or '',
        'email': email,
        'password': hashed,
        'role': role,
        'age': age,
        'gender': gender,
        'insurance': insurance,
        'specialty': specialty,
        'clinic': clinic,
    }

    users.append(user)
    _save_users(users)

    public = user.copy()
    public.pop('password', None)
    token = f'json-token-{user_id}'
    return JsonResponse({'user': public, 'token': token})



@csrf_exempt
def login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8') or '{}')
    except Exception:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return JsonResponse({'error': 'email and password required'}, status=400)

    users = _load_users()
    user = next((u for u in users if u.get('email') == email), None)
    if not user:
        return JsonResponse({'error': 'Invalid credentials'}, status=401)

    if not check_password(password, user.get('password', '')):
        return JsonResponse({'error': 'Invalid credentials'}, status=401)

    public = user.copy()
    public.pop('password', None)
    token = f'json-token-{user.get("id")}'
    return JsonResponse({'user': public, 'token': token})


@csrf_exempt
def logout(request):
    # stateless for JSON token approach — client can just remove token locally
    return JsonResponse({'ok': True})


def me(request):
    # Accept Authorization: Bearer json-token-<id>
    auth = request.META.get('HTTP_AUTHORIZATION', '')
    if not auth.startswith('Bearer '):
        return JsonResponse({'error': 'Authorization required'}, status=401)

    token = auth.split(' ', 1)[1]
    if not token.startswith('json-token-'):
        return JsonResponse({'error': 'Invalid token'}, status=401)
    user_id = token[len('json-token-'):]

    users = _load_users()
    user = next((u for u in users if u.get('id') == user_id), None)
    if not user:
        return JsonResponse({'error': 'User not found'}, status=404)

    public = user.copy()
    public.pop('password', None)
    return JsonResponse({'user': public})
