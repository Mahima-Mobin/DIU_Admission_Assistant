import requests
import uuid
import sys

base = 'http://127.0.0.1:5000'
email = f"e2e_{uuid.uuid4().hex[:8]}@example.com"
password = 'TestPass123'
name = 'E2E Tester'

def fail(msg):
    print('FAIL:', msg)
    sys.exit(1)

def main():
    s = requests.Session()
    # Register
    r = s.post(base + '/api/register', json={'name': name, 'email': email, 'password': password})
    if r.status_code not in (200,201):
        fail(f'register failed {r.status_code} {r.text}')
    print('Registered:', email)

    # Login
    r = s.post(base + '/api/login', json={'email': email, 'password': password})
    if r.status_code != 200:
        fail(f'login failed {r.status_code} {r.text}')
    print('Logged in')

    # Dashboard
    r = s.get(base + '/dashboard')
    if r.status_code != 200:
        fail(f'dashboard fetch failed {r.status_code} {r.text}')
    if name not in r.text:
        fail('dashboard content did not include username')
    print('Dashboard OK')
    print('E2E test passed')

if __name__ == '__main__':
    main()
